from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Produto
from .serializers import ProdutoSerializer

# Create your views here.

class ProdutoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD completo de Produtos.
    Fornece automaticamente as ações: list, create, retrieve, update, destroy
    """
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    
    # Configurar filtros e busca
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['preco', 'estoque']  # Filtrar por preço e estoque
    search_fields = ['nome', 'descricao']    # Buscar por nome e descrição
    ordering_fields = ['nome', 'preco', 'estoque']  # Permitir ordenação
    ordering = ['nome']  # Ordenação padrão por nome
    
    @action(detail=False, methods=['get'])
    def em_estoque(self, request):
        """
        Endpoint personalizado: /produtos/em_estoque/
        Retorna apenas produtos com estoque > 0
        """
        produtos_disponveis = Produto.objects.filter(estoque__gt=0)
        serializer = self.get_serializer(produtos_disponveis, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def promocao(self, request):
        """
        Endpoint personalizado: /produtos/promocao/
        Retorna produtos com preço abaixo de R$ 100
        """
        produtos_promocao = Produto.objects.filter(preco__lt=100)
        serializer = self.get_serializer(produtos_promocao, many=True)
        return Response(serializer.data)