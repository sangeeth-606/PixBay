import React, { useRef, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/calendar-styles.css';
import CalenderTaskModal from '../components/CalenderTaskModal';


interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color: string;
  workspaceName?: string
}

// Define props interface for Calendar component
interface CalendarProps {
  workspaceName?: string;
}

const convertTailwindColorToHex = (color: string) => {
  const colorMap: Record<string, string> = {
    'bg-emerald-500': '#10B981', 
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#a855f7',
    'bg-green-500': '#22c55e',
    'bg-indigo-600': '#4F46E5',
    // Add more mappings as needed
  };
  return colorMap[color] || '#10B981'; // Default to emerald if not found
};


const convertEventsToFullCalendarFormat = (events: CalendarEvent[]) => {
  return events.map(event => {
    const eventDate = new Date(event.date);
    let start = null;
    let end = null;
    
    if (event.startTime) {
      const [hours, minutes] = event.startTime.split(':').map(Number);
      start = new Date(eventDate);
      start.setHours(hours, minutes);
      
      if (event.endTime) {
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);
        end = new Date(eventDate);
        end.setHours(endHours, endMinutes);
      }
    } else {
      start = eventDate;
    }
    
    return {
      id: event.id,
      title: event.title,
      start: start,
      end: end || undefined,
      backgroundColor: convertTailwindColorToHex(event.color),
      borderColor: convertTailwindColorToHex(event.color),
      textColor: '#FFFFFF', 
      classNames: 'rounded-md shadow-sm' 
    };
  });
};

const Calendar: React.FC<CalendarProps> = ({ workspaceName }) => {
  const calendarRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [taskState, setTaskState] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Project Meeting',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: '10:00',
      endTime: '11:30',
      color: 'bg-emerald-500'
    },
    {
      id: '2',
      title: 'Code Review',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:00',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: 'Sprint Planning',
      date: new Date("2025-04-19"),
      startTime: '09:00',
      endTime: '10:30',
      color: 'bg-indigo-600'
    },
  ]);

  const handleDateClick = (arg: any) => {
    // Store the selected date and open the modal
    setSelectedDate(arg.dateStr);
    setTaskState(true);

    console.log('Date clicked', arg);
  };

  const handleEventClick = (arg: any) => {
    // Implement editing an event when clicking on it
    console.log('Event clicked', arg);
  };

  const handleTaskAdded = () => {
    // Refresh events or handle any logic after task is added
    console.log("Task added successfully");
  };

 
  const viewOptions = [
    { name: 'Month', view: 'dayGridMonth' },
    { name: 'Week', view: 'timeGridWeek' },
    { name: 'Day', view: 'timeGridDay' }
  ];

  const changeView = (viewName: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewName);
    }
  };


  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        // Calculate available space (with a small buffer)
        const availableHeight = viewportHeight - containerTop - 40;
        setContainerHeight(Math.max(500, availableHeight)); 
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#1C1C1C] text-white p-6 rounded-lg flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold font-inter">Calendar</h2>
          {workspaceName && <span className="text-sm text-gray-400">({workspaceName})</span>}
        </div>
        <CalenderTaskModal 
          workspaceName={workspaceName}
          isOpen={taskState} 
          onClose={() => setTaskState(false)}
          darkMode={isDarkMode}
          projectId="" // You'll need to provide a default or actual project ID
          onTaskAdded={handleTaskAdded}
          selectedDate={selectedDate}
        />
        
        {/* View selection buttons */}
        <div className="flex space-x-2 bg-[#171717] rounded-md p-1">
          {viewOptions.map((option) => (
            <button
              key={option.view}
              onClick={() => changeView(option.view)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#333] focus:outline-none"
            >
              {option.name}
            </button>
          ))}
        </div>
        
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 font-medium transition-all transform hover:scale-105">
          <Plus size={18} />
          <span>New Event</span>
        </button>
      </div>
      
      {/* Calendar wrapper with custom styling */}
      <div className="fullcalendar-dark flex-grow overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''  // We're using custom view buttons
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={convertEventsToFullCalendarFormat(events)}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height={containerHeight || "auto"}
          themeSystem="standard"
          dayCellClassNames="bg-[#171717] hover:bg-[#333] border-[#2C2C2C]"
          eventClassNames="rounded-md"
          slotLabelClassNames="text-gray-400"
          dayHeaderClassNames="text-gray-400 font-medium"
          titleFormat={{ year: 'numeric', month: 'long' }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}
          // Add these styling options to ensure all elements use dark theme
          viewClassNames="bg-[#1C1C1C]"
          allDayClassNames="bg-[#1C1C1C] text-white"
          nowIndicatorClassNames="bg-emerald-500"
        />
      </div>
    </div>
  );
};

export default Calendar;