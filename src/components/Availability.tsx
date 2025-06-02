import React from "react";
import { Provider } from "@/core/domain/entities";
import { Calendar } from "@heroui/calendar";
import { today, getLocalTimeZone, type CalendarDate } from "@internationalized/date";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { useState } from "react";

interface AvailabilityProps {
  providerData: Provider;
}

interface Event {
  id: string
  title: string
  time: string
  duration: string
  type: "booked" | "available" | "blocked"
  client?: string
}

// Mock data for events - replace with real data from your API
const mockEvents: Record<string, Event[]> = {
  "2025-06-02": [
    {
      id: "1",
      title: "Concierto Privado",
      time: "19:00",
      duration: "2 horas",
      type: "booked",
      client: "María González",
    },
    {
      id: "2",
      title: "Disponible",
      time: "14:00",
      duration: "3 horas",
      type: "available",
    },
  ],
  "2025-06-15": [
    {
      id: "3",
      title: "Evento Corporativo",
      time: "18:00",
      duration: "4 horas",
      type: "booked",
      client: "Empresa XYZ",
    },
  ],
  "2025-06-20": [
    {
      id: "4",
      title: "Disponible - Mañana",
      time: "10:00",
      duration: "4 horas",
      type: "available",
    },
    {
      id: "5",
      title: "Disponible - Tarde",
      time: "16:00",
      duration: "3 horas",
      type: "available",
    },
  ],
  "2025-07-04": [
    {
      id: "6",
      title: "Mantenimiento Equipos",
      time: "Todo el día",
      duration: "8 horas",
      type: "blocked",
    },
  ],
}


export const Availability: React.FC<AvailabilityProps> = ({
}) => {

  const defaultDate = today(getLocalTimeZone())
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(defaultDate)
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(defaultDate)

  const getEventsForDate = (date: CalendarDate | null): Event[] => {
    if (!date) return []
    const dateKey = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
    return mockEvents[dateKey] || []
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "booked":
        return "danger"
      case "available":
        return "success"
      case "blocked":
        return "warning"
      default:
        return "default"
    }
  }

  const getEventTypeText = (type: Event["type"]) => {
    switch (type) {
      case "booked":
        return "Ocupado"
      case "available":
        return "Disponible"
      case "blocked":
        return "Bloqueado"
      default:
        return "Desconocido"
    }
  }

  const formatSelectedDate = (date: CalendarDate | null) => {
    if (!date) return ""
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return `${date.day} de ${months[date.month - 1]}, ${date.year}`
  }

  const selectedEvents = getEventsForDate(selectedDate)

  return (
    <div className="p-8 bg-content1 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4 pb-8">
        <h2 className="text-lg font-semibold text-foreground">Disponibilidad</h2>
        <p className="text-gray-500 pl-8">
          La disponibilidad del proveedor se puede gestionar aquí.
          <br />
          Selecciona una fecha para ver los eventos programados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <Calendar
          className="w-full lg:col-span-2"
          aria-label="Calendario de disponibilidad"
          minValue={defaultDate}
          focusedValue={focusedDate}
          value={selectedDate}
          onFocusChange={setFocusedDate}
          onChange={setSelectedDate}
          visibleMonths={3}
        />

        {/* Events Section */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{selectedDate ? "Eventos del día" : "Selecciona una fecha"}</h3>
                {selectedDate && <p className="text-sm text-gray-500">{formatSelectedDate(selectedDate)}</p>}
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="pt-4">
              {selectedEvents.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Chip size="sm" color={getEventTypeColor(event.type)} variant="flat">
                          {getEventTypeText(event.type)}
                        </Chip>
                      </div>

                      <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Hora:</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duración:</span>
                          <span>{event.duration}</span>
                        </div>
                        {event.client && (
                          <div className="flex justify-between">
                            <span>Cliente:</span>
                            <span>{event.client}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedDate ? (
                    <div className="flex flex-col gap-2">
                      <p>No hay eventos programados</p>
                      <p className="text-xs">para esta fecha</p>
                    </div>
                  ) : (
                    <p>Selecciona una fecha en el calendario</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
/* Availability.tsx */