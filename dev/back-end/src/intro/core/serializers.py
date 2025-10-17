from rest_framework import serializers
from .models import Produto


class ProdutoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Produto.
    Converte objetos Python em JSON e vice-versa.
    """
    
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'descricao', 'estoque']
        
    def validate_preco(self, value):
        """Validação personalizada para preço"""
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value
    
    def validate_estoque(self, value):
        """Validação personalizada para estoque"""
        if value < 0:
            raise serializers.ValidationError("O estoque não pode ser negativo.")
        return value