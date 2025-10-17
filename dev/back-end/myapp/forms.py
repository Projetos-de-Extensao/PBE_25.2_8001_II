from django import forms
from .models import Usuario, Candidatura

class LoginForm(forms.Form):
    email_institucional = forms.EmailField(
        label='Email Institucional',
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'seu.email@universidade.edu.br'})
    )
    password = forms.CharField(
        label='Senha',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Sua senha'})
    )

class CadastroForm(forms.ModelForm):
    password = forms.CharField(
        label='Senha',
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
    confirm_password = forms.CharField(
        label='Confirmar Senha',
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'matricula', 'email_institucional']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Seu nome'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Seu sobrenome'}),
            'matricula': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Sua matrícula'}),
            'email_institucional': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'seu.email@universidade.edu.br'}),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password != confirm_password:
            raise forms.ValidationError("As senhas não coincidem")
        
        return cleaned_data

class CandidaturaForm(forms.ModelForm):
    class Meta:
        model = Candidatura
        fields = ['observacoes_aluno']
        widgets = {
            'observacoes_aluno': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Por que você quer ser monitor desta disciplina? Quais suas qualificações?',
                'rows': 4
            }),
        }
        labels = {
            'observacoes_aluno': 'Motivação e Qualificações'
        }