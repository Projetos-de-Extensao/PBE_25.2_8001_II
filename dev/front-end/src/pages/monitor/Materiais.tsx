import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Search,
  FileText,
  Image,
  Video,
  Folder
} from 'lucide-react';

// Mock data - in real app would fetch from API
const mockMateriais = [
  {
    id: '1',
    nome: 'Lista de Exercícios - Derivadas.pdf',
    tipo: 'PDF',
    tamanho: '2.3 MB',
    dataUpload: '2024-11-18',
    categoria: 'Exercícios',
    downloads: 15
  },
  {
    id: '2',
    nome: 'Resumo - Limites.docx',
    tipo: 'DOCX',
    tamanho: '856 KB',
    dataUpload: '2024-11-15',
    categoria: 'Resumos',
    downloads: 23
  },
  {
    id: '3',
    nome: 'Video Aula - Integrais.mp4',
    tipo: 'VIDEO',
    tamanho: '45.2 MB',
    dataUpload: '2024-11-12',
    categoria: 'Vídeos',
    downloads: 8
  },
  {
    id: '4',
    nome: 'Formulário - Cálculo I.png',
    tipo: 'IMAGE',
    tamanho: '1.1 MB',
    dataUpload: '2024-11-10',
    categoria: 'Formulários',
    downloads: 31
  }
];

const categorias = ['Todos', 'Exercícios', 'Resumos', 'Vídeos', 'Formulários'];

export const Materiais = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materiais, setMateriais] = useState(mockMateriais);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleUpload = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O upload de arquivos estará disponível em breve.",
    });
  };

  const handleDownload = (material: any) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${material.nome}...`,
    });
  };

  const handleDelete = (materialId: string) => {
    setMateriais(materiais.filter(m => m.id !== materialId));
    toast({
      title: "Material removido",
      description: "O arquivo foi removido do repositório.",
    });
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'PDF':
      case 'DOCX':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'IMAGE':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'VIDEO':
        return <Video className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const materiaisFiltrados = materiais.filter(material => {
    const matchCategoria = filtroCategoria === 'Todos' || material.categoria === filtroCategoria;
    const matchBusca = material.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.nome} 
        userRole={user.role}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="outline" onClick={() => navigate('/monitor/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Repositório de Materiais</h1>
          <p className="text-muted-foreground">Gerencie os materiais de apoio para suas monitorias</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Filtros e Upload */}
          <div className="space-y-6">
            {/* Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Adicionar Material</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleUpload} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Arquivo
                </Button>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Filtrar por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categorias.map((categoria) => (
                  <Button
                    key={categoria}
                    variant={filtroCategoria === categoria ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFiltroCategoria(categoria)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    {categoria}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Total de arquivos:</span>
                  <span className="font-medium">{materiais.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads totais:</span>
                  <span className="font-medium">
                    {materiais.reduce((total, m) => total + m.downloads, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mais baixado:</span>
                  <span className="font-medium">
                    {materiais.reduce((prev, current) => 
                      prev.downloads > current.downloads ? prev : current
                    ).nome.split('.')[0].substring(0, 15)}...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome do arquivo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Materiais */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">
                  Meus Materiais 
                  <Badge variant="outline" className="ml-2">
                    {materiaisFiltrados.length} arquivo{materiaisFiltrados.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {materiaisFiltrados.length > 0 ? (
                  <div className="space-y-3">
                    {materiaisFiltrados.map((material) => (
                      <div key={material.id} className="p-4 border border-wireframe-medium rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(material.tipo)}
                            <div className="flex-1">
                              <h3 className="font-medium wireframe-text">{material.nome}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{material.tamanho}</span>
                                <span>•</span>
                                <span>{material.dataUpload}</span>
                                <span>•</span>
                                <span>{material.downloads} downloads</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {material.categoria}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownload(material)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {busca || filtroCategoria !== 'Todos' 
                        ? 'Nenhum material encontrado com os filtros aplicados'
                        : 'Nenhum material cadastrado ainda'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};