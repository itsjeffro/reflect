import { Flex, Grid, Heading, Text } from "@radix-ui/themes"
import { format, getDay, isSameDay, isToday, startOfMonth } from "date-fns"
import { getDaysInMonth } from "date-fns/fp";
import { range } from "../utils";
import { useCallback } from "react";
import styled from "@emotion/styled";

type DailyEvents = {
  [date: string]: { count: number };
};

type CalendarMonthProps = {
  events?: DailyEvents;
  date: Date;
  month: number;
  selectedDate?: Date | string;
  onDateClick?: (date: Date) => void;
};

const days = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export const CalendarMonth = ({ date, events, month, selectedDate, onDateClick }: CalendarMonthProps) => {
  const currentDate = date.setMonth(month - 1);
  const daysInMonth = getDaysInMonth(currentDate);

  const dateRange = range(1, daysInMonth).map((day) => {
    const date = new Date(currentDate);
    return date.setDate(day);
  }) as unknown as Date[];

  const firstDayOfMonth = startOfMonth(currentDate);
  const startDay = getDay(firstDayOfMonth);
  const startColumn = startDay === 0 ? 7 : startDay;

  const handleDayClick = useCallback((date: Date) => {
    onDateClick?.(date);
  }, [onDateClick]);

  return (
    <Flex direction="column" gap="1">
      <Heading size="2">{format(currentDate, 'MMMM')}</Heading>

      <Grid columns="repeat(7, 1fr)" gap="1">
        {days.map((day) => (
          <Flex key={`${day}-${month}`} justify="center">
            <DayText size="1" color="gray">{day[0]}</DayText>
          </Flex>
        ))}

        {dateRange.map((date, index) => (
          <DateBlock
            key={format(date, 'y-MM-dd')}
            onClick={() => handleDayClick(date)}
            style={index === 0 ? { gridColumnStart: startColumn } : undefined}
            isToday={isToday(date)}
            isSelected={!!(selectedDate && isSameDay(selectedDate, date))}
            hasEvents={!!events?.[format(date, 'y-MM-dd')]}
          >
            {format(date, 'd')}
          </DateBlock>
        ))}
      </Grid>
    </Flex>
  )
};

const DayText = styled(Text)({
  textTransform: 'uppercase'
});

type DateBlockProps = {
  isToday?: boolean;
  isSelected?: boolean;
  hasEvents?: boolean;
}

const DateBlock = styled(Flex, {
  shouldForwardProp: (prop) => !['isToday', 'isSelected', 'hasEvents'].includes(prop),
})<DateBlockProps>(({ isToday, isSelected, hasEvents }) => ({
  borderRadius: '3px',
  padding: '0.125rem 0',
  fontSize: '.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  border: '1px solid transparent',
  '&:hover': {
    background: '#edeff5',
  },
  ...(hasEvents && {
    background: '#edeff5',
    '&:hover': {
      background: '#e4e7ee'
    }
  }),
  ...(isToday && {
    borderColor: '#9e9e9e',
  }),
  ...(isSelected && {
    borderColor: 'transparent',
    background: 'var(--bg-primary)',
    color: '#fff',
    '&:hover': {
      background: '#317ae0'
    }
  })
}));
