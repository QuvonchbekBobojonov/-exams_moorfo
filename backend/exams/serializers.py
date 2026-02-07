from rest_framework import serializers
from .models import Exam, Question, Choice

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text')

class AdminChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text', 'is_correct')

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'code', 'points', 'choices')

class AdminQuestionSerializer(serializers.ModelSerializer):
    choices = AdminChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'code', 'points', 'choices')

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ('id', 'title', 'description', 'duration_minutes', 'passing_score', 'questions')

class AdminExamSerializer(serializers.ModelSerializer):
    questions = AdminQuestionSerializer(many=True)

    class Meta:
        model = Exam
        fields = ('id', 'course', 'title', 'description', 'duration_minutes', 'passing_score', 'questions')

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        exam = Exam.objects.create(**validated_data)
        for question_data in questions_data:
            choices_data = question_data.pop('choices')
            question = Question.objects.create(exam=exam, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        return exam

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.duration_minutes = validated_data.get('duration_minutes', instance.duration_minutes)
        instance.passing_score = validated_data.get('passing_score', instance.passing_score)
        instance.course = validated_data.get('course', instance.course)
        instance.save()

        if questions_data is not None:
            # Simple approach: clear and recreate for "convenient" builder
            instance.questions.all().delete()
            for question_data in questions_data:
                choices_data = question_data.pop('choices')
                question = Question.objects.create(exam=instance, **question_data)
                for choice_data in choices_data:
                    Choice.objects.create(question=question, **choice_data)
        
        return instance
