import React from 'react';
import type { PortfolioItem } from '@/core/domain/entities'
import { portfolioRepository } from '@/core/infrastructure/repositories/inMemory'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ArrowLeft, Calendar, Eye, EyeOff, Download, ExternalLink } from 'lucide-react';
import { getItemTypeIcon, getItemTypeColor } from "../../../utils/portfolioHelper";
import { useAuthStore } from '@/stores/authStore';

export const Route = createFileRoute('/provider/$id/portfolio-item/$itemId')({
  component: RouteComponent,
  loader: async ({ params }): Promise<PortfolioItem> => {
    // if (!context.auth?.user?.id) throw redirect({ to: '/login' });

    const portfolio = await portfolioRepository.getByProviderId(params.id)

    if (!portfolio) throw notFound()

    const item = portfolio?.items.find(item => item.id === params.itemId)

    if (!item) throw notFound()

    return item
  }
})

function RouteComponent() {
  const portfolioItem = Route.useLoaderData()
  const params = Route.useParams()
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.user?.id)

  const handleGoBack = () => {
    navigate({ to: `/provider/$id`, params: { id: params.id } })
  }

  const renderMainContent = () => {
    if (!portfolioItem.fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg">
          {React.createElement(
            getItemTypeIcon(portfolioItem.type),
            { className: "w-16 h-16 text-gray-400 mb-4" }
          )}
          <p className="text-gray-400 text-lg">No hay archivo disponible</p>
        </div>
      )
    }

    switch (portfolioItem.type) {
      case 'Photo':
        return (
          <div className="relative">
            <img
              src={portfolioItem.fileUrl}
              alt={portfolioItem.title}
              className="w-full h-auto max-h-[600px] object-contain rounded-lg bg-gray-900"
            />
            <Button
              size="sm"
              variant="flat"
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
              startContent={<ExternalLink className="w-4 h-4" />}
              onPress={() => window.open(portfolioItem.fileUrl, '_blank')}
            >
              Ver en tamaño completo
            </Button>
          </div>
        )

      case 'Video':
        return (
          <div className="relative">
            <video
              src={portfolioItem.fileUrl}
              controls
              className="w-full h-auto max-h-[600px] rounded-lg bg-gray-900"
              poster="/api/placeholder/800/450"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )

      case 'Audio':
        return (
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {React.createElement(
                  getItemTypeIcon(portfolioItem.type),
                  { className: "w-16 h-16 text-white" }
                )}
              </div>
              <audio
                src={portfolioItem.fileUrl}
                controls
                className="w-full max-w-md"
              >
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </div>
        )

      case 'Description':
        return (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              src={portfolioItem.fileUrl}
              title={portfolioItem.title}
              className="w-full min-h-[600px] border-0"
              style={{ minHeight: "600px" }}
            />
          </div>
        )

      case 'Testimonial':
        return (
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                {React.createElement(
                  getItemTypeIcon(portfolioItem.type),
                  { className: "w-10 h-10 text-white" }
                )}
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Testimonios de Clientes</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {portfolioItem.description}
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Tipo de contenido no soportado</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con navegación */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            startContent={<ArrowLeft className="w-4 h-4" />}
            onPress={handleGoBack}
            className="text-gray-400 hover:text-foreground"
          >
            Volver al Perfil
          </Button>

          <Chip
            size="lg"
            className={`${getItemTypeColor(portfolioItem.type)} border border-gray-600`}
            startContent={React.createElement(getItemTypeIcon(portfolioItem.type), { className: "w-5 h-5" })}
          >
            {portfolioItem.type}
          </Chip>
        </div>

        {/* Contenido principal */}
        <Card className="overflow-hidden bg-content1 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-foreground">{portfolioItem.title}</h1>
                <div className="flex items-center space-x-2">
                  {portfolioItem.isVisible ? (
                    <Chip size="sm" color="success" startContent={<Eye className="w-4 h-4" />}>
                      Visible
                    </Chip>
                  ) : (
                    <Chip size="sm" color="warning" startContent={<EyeOff className="w-4 h-4" />}>
                      Oculto
                    </Chip>
                  )}
                </div>
              </div>
              <p className="text-gray-300 text-lg">{portfolioItem.description}</p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="p-6">
            {renderMainContent()}
          </CardBody>

          <Divider />

          {/* Footer con información adicional */}
          <div className="p-6 bg-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Añadido el {new Date(portfolioItem.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {portfolioItem.fileUrl && portfolioItem.type !== 'Description' && (
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Download className="w-4 h-4" />}
                    onPress={() => {
                      const link = document.createElement('a')
                      link.href = portfolioItem.fileUrl!
                      link.download = portfolioItem.title
                      link.click()
                    }}
                  >
                    Descargar
                  </Button>
                )}
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => {
                    // Aquí iría la lógica para editar el item
                    console.log('Editar item:', portfolioItem.id)
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        {portfolioItem.relatedServices && portfolioItem.relatedServices.length > 0 && (
          <Card className="bg-content1">
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">Servicios Relacionados</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {portfolioItem.relatedServices.map((service, index) => (
                  <Chip key={index} variant="flat" color="primary">
                    {service.name}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}