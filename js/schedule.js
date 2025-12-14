// Gerenciamento de agendamento e calendário
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// Horários disponíveis
const availableHours = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
];

// Agendamentos existentes (simulado - em produção viria de um backend)
const existingAppointments = {};

// Inicializar calendário
function initCalendar() {
    renderCalendar();
    setupCalendarNavigation();
    setupTimeSlots();
    setupScheduleForm();
}

// Renderizar calendário
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthEl = document.getElementById('currentMonth');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Nome do mês em português
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    currentMonthEl.textContent = `${monthNames[month]} ${year}`;

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Limpar grid
    calendarGrid.innerHTML = '';

    // Cabeçalhos dos dias da semana
    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    // Dias do mês anterior (para preencher primeira semana)
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(day);
    }

    // Dias do mês atual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month, day);

        // Marcar hoje
        if (dateObj.toDateString() === today.toDateString()) {
            dayEl.style.border = '2px solid var(--accent-color)';
        }

        // Marcar como disponível se não for passado
        if (dateObj >= today) {
            dayEl.classList.add('available');
        }

        // Marcar como selecionado
        if (selectedDate && dateStr === selectedDate) {
            dayEl.classList.add('selected');
        }

        // Adicionar evento de clique
        if (dateObj >= today) {
            dayEl.addEventListener('click', () => selectDate(dateStr, dateObj));
        }

        calendarGrid.appendChild(dayEl);
    }

    // Preencher dias restantes da última semana
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semanas * 7 dias

    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    }
}

// Navegação do calendário
function setupCalendarNavigation() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateTimeSlots();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateTimeSlots();
    });
}

// Selecionar data
function selectDate(dateStr, dateObj) {
    selectedDate = dateStr;
    selectedTime = null;

    // Atualizar campo de data
    const selectedDateInput = document.getElementById('selectedDate');
    const dateFormatted = dateObj.toLocaleDateString('pt-BR');
    selectedDateInput.value = dateFormatted;

    // Re-renderizar calendário
    renderCalendar();

    // Atualizar horários disponíveis
    updateTimeSlots();
}

// Configurar slots de horário
function setupTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedTimeSelect = document.getElementById('selectedTime');

    // Limpar opções existentes
    selectedTimeSelect.innerHTML = '<option value="">Selecione um horário</option>';

    availableHours.forEach(hour => {
        // Adicionar ao container visual
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = hour;
        slot.dataset.time = hour;

        slot.addEventListener('click', () => selectTime(hour));
        timeSlotsContainer.appendChild(slot);

        // Adicionar ao select
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        selectedTimeSelect.appendChild(option);
    });

    // Evento do select
    selectedTimeSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            selectTime(e.target.value);
        }
    });
}

// Atualizar slots de horário baseado na data selecionada
function updateTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedTimeSelect = document.getElementById('selectedTime');

    if (!selectedDate) {
        timeSlots.forEach(slot => {
            slot.classList.remove('selected', 'unavailable');
        });
        return;
    }

    // Verificar horários já agendados para esta data
    const appointmentsForDate = existingAppointments[selectedDate] || [];

    timeSlots.forEach(slot => {
        const time = slot.dataset.time;
        slot.classList.remove('selected', 'unavailable');

        if (appointmentsForDate.includes(time)) {
            slot.classList.add('unavailable');
            // Desabilitar opção no select
            const option = selectedTimeSelect.querySelector(`option[value="${time}"]`);
            if (option) option.disabled = true;
        } else {
            // Habilitar opção no select
            const option = selectedTimeSelect.querySelector(`option[value="${time}"]`);
            if (option) option.disabled = false;
        }

        if (selectedTime === time) {
            slot.classList.add('selected');
        }
    });
}

// Selecionar horário
function selectTime(time) {
    if (!selectedDate) {
        alert('Por favor, selecione uma data primeiro.');
        return;
    }

    // Verificar se horário está disponível
    const appointmentsForDate = existingAppointments[selectedDate] || [];
    if (appointmentsForDate.includes(time)) {
        alert('Este horário já está agendado. Por favor, escolha outro.');
        return;
    }

    selectedTime = time;

    // Atualizar visual
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
        if (slot.dataset.time === time) {
            slot.classList.add('selected');
        }
    });

    // Atualizar select
    document.getElementById('selectedTime').value = time;
}

// Configurar formulário de agendamento
function setupScheduleForm() {
    const form = document.getElementById('scheduleForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedTime) {
            alert('Por favor, selecione uma data e horário.');
            return;
        }

        const clientName = document.getElementById('clientName').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const serviceType = document.getElementById('serviceType').value;

        // Simular agendamento
        if (!existingAppointments[selectedDate]) {
            existingAppointments[selectedDate] = [];
        }
        existingAppointments[selectedDate].push(selectedTime);

        // Mostrar confirmação
        alert(`Agendamento confirmado!\n\nCliente: ${clientName}\nTelefone: ${clientPhone}\nServiço: ${getServiceName(serviceType)}\nData: ${document.getElementById('selectedDate').value}\nHorário: ${selectedTime}\n\nObrigado por escolher nossos serviços!`);

        // Limpar formulário
        form.reset();
        selectedDate = null;
        selectedTime = null;
        document.getElementById('selectedDate').value = '';
        renderCalendar();
        updateTimeSlots();
    });
}

// Obter nome do serviço
function getServiceName(serviceKey) {
    const names = {
        colchao: 'Limpeza de Colchão',
        sofa: 'Limpeza de Sofá',
        carro: 'Limpeza de Carro',
        casa: 'Limpeza Residencial',
        escritorio: 'Limpeza Comercial',
        tapete: 'Limpeza de Tapetes'
    };
    return names[serviceKey] || serviceKey;
}

// Exportar para uso global
window.initCalendar = initCalendar;
