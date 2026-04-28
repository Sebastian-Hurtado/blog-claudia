import os

from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import BlogPage, Comment, ConsultationAttachment, ConsultationRequest
from .serializers import (
    CommentCreateSerializer,
    CommentSerializer,
    ConsultationRequestCreateSerializer,
    ConsultationRequestListSerializer,
)

ALLOWED_CONSULTATION_EXTENSIONS = {".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"}
MAX_CONSULTATION_ATTACHMENTS = 5
MAX_CONSULTATION_FILE_SIZE = 10 * 1024 * 1024


def health(request):
    return JsonResponse({"status": "ok"})


@api_view(["GET"])
def list_comments(request, slug):
    """
    GET /api/comments/<slug>/
    Devuelve los comentarios aprobados de un post.
    """

    try:
        post = BlogPage.objects.live().get(slug=slug)
    except BlogPage.DoesNotExist:
        return Response({"error": "Post no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    comments = Comment.objects.filter(post=post, is_approved=True)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_comment(request):
    """
    POST /api/comments/
    Crea un comentario. El frontend envia los datos del usuario
    desde la sesion de Google (NextAuth).
    """

    serializer = CommentCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    slug = serializer.validated_data["post_slug"]
    try:
        post = BlogPage.objects.live().get(slug=slug)
    except BlogPage.DoesNotExist:
        return Response({"error": "Post no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if not post.allow_comments:
        return Response(
            {"error": "Los comentarios estan cerrados en esta publicacion."},
            status=status.HTTP_403_FORBIDDEN,
        )

    comment = Comment.objects.create(
        post=post,
        author_name=serializer.validated_data["author_name"],
        author_email=serializer.validated_data["author_email"],
        author_image=serializer.validated_data.get("author_image", ""),
        content=serializer.validated_data["content"],
    )

    return Response(
        {
            "id": comment.id,
            "status": "pending",
            "message": "Tu comentario fue enviado y esta pendiente de revision.",
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser])
def create_consultation_request(request):
    """
    GET/POST /api/consultation-requests/
    Endpoint interno para listar o crear solicitudes de consultoria
    desde el proxy del frontend.
    """

    secret = request.headers.get("X-Consultation-Proxy-Secret", "")
    if secret != settings.CONSULTATION_PROXY_SECRET:
        return Response(
            {"error": "No autorizado para crear solicitudes de consultoria."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "GET":
        email = request.GET.get("email", "").strip()
        if not email:
            return Response(
                {"error": "Debes indicar el correo del solicitante."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        consultations = ConsultationRequest.objects.filter(email__iexact=email).order_by(
            "-created_at"
        )
        serializer = ConsultationRequestListSerializer(consultations, many=True)
        return Response(serializer.data)

    serializer = ConsultationRequestCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    attachments = request.FILES.getlist("attachments")
    if len(attachments) > MAX_CONSULTATION_ATTACHMENTS:
        return Response(
            {"error": f"Solo se permiten hasta {MAX_CONSULTATION_ATTACHMENTS} archivos."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    for attachment in attachments:
        extension = os.path.splitext(attachment.name)[1].lower()
        if extension not in ALLOWED_CONSULTATION_EXTENSIONS:
            return Response(
                {"error": f"Tipo de archivo no permitido: {attachment.name}."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if attachment.size > MAX_CONSULTATION_FILE_SIZE:
            return Response(
                {"error": f"El archivo {attachment.name} supera el maximo de 10 MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    consultation = ConsultationRequest.objects.create(
        full_name=serializer.validated_data["full_name"],
        email=serializer.validated_data["email"],
        phone=serializer.validated_data["phone"],
        subject=serializer.validated_data["subject"],
        message=serializer.validated_data["message"],
    )

    for attachment in attachments:
        ConsultationAttachment.objects.create(
            request=consultation,
            file=attachment,
        )

    return Response(
        {
            "id": consultation.id,
            "status": consultation.status,
            "message": "Tu solicitud fue enviada correctamente. Pronto sera revisada.",
        },
        status=status.HTTP_201_CREATED,
    )
