from rest_framework import serializers

from .models import Comment, ConsultationRequest, GuestPostSubmission


class CommentSerializer(serializers.ModelSerializer):
    """Serializer de lectura para comentarios."""

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "author_name",
            "author_email",
            "author_image",
            "content",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CommentCreateSerializer(serializers.Serializer):
    """
    Serializer de escritura.
    Recibe el slug del post + datos del usuario Google.
    """

    post_slug = serializers.SlugField()
    author_name = serializers.CharField(max_length=150)
    author_email = serializers.EmailField()
    author_image = serializers.URLField(required=False, default="")
    content = serializers.CharField(min_length=1, max_length=2000)


class ConsultationRequestCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=50)
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField(min_length=1, max_length=5000)


class ConsultationRequestListSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ConsultationRequest
        fields = ["id", "subject", "status", "status_label", "created_at"]
        read_only_fields = fields


class ConsultationRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationRequest
        fields = ["status", "internal_notes"]


class GuestPostSubmissionCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    author_image = serializers.URLField(required=False, allow_blank=True, default="")
    title = serializers.CharField(max_length=200)
    summary = serializers.CharField(max_length=250)
    content = serializers.CharField(min_length=1, max_length=20000)
    suggested_tags = serializers.CharField(
        max_length=250,
        required=False,
        allow_blank=True,
        default="",
    )
    publish_anonymously = serializers.BooleanField(default=False)
    author_confirmed = serializers.BooleanField()

    def validate_author_confirmed(self, value):
        if not value:
            raise serializers.ValidationError(
                "Debes confirmar que eres responsable del contenido enviado."
            )
        return value


class GuestPostSubmissionListSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = GuestPostSubmission
        fields = [
            "id",
            "title",
            "status",
            "status_label",
            "editorial_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class GuestPostSubmissionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestPostSubmission
        fields = ["status", "editorial_notes"]
