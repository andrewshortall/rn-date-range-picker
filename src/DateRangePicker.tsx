import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
const isBetween = require('dayjs/plugin/isBetween');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const weekday = require('dayjs/plugin/weekday');

require('dayjs/locale/de');
require('dayjs/locale/fr');
require('dayjs/locale/es');

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

import CalendarDate from './CalendarDate';
import WeekdayHeader from './WeekdayHeader';

import type { DatePickerStyles, DateRangePickerProps } from './utils/types';
import { defaultTheme } from './utils/theme';

const makeStyles = (
  elementWidth = Dimensions.get('screen').width,
  theme = defaultTheme,
  {
    calendarMonth = {},
    monthHeaderLabel = {},
    navButton = {},
    weekdaysHeader = {},
  }: DatePickerStyles = {}
) =>
  StyleSheet.create({
    container: {
      width: elementWidth,
      backgroundColor: theme.background,
    },
    cell: {
      width: Math.floor(elementWidth / 7),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    calendarMonth: {
      paddingVertical: 16,
      width: '100%',
      ...calendarMonth,
    },
    monthHeaderLabel: {
      fontSize: 17,
      fontWeight: 'bold',
      marginVertical: 12,
      color: theme.foreground,
      ...monthHeaderLabel,
    },
    navButton: {
      margin: 8,
      ...navButton,
    },
    navButtonLabel: {
      color: theme.foreground,
    },
    weekdaysHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: 30,
      ...weekdaysHeader,
    },
    divider: {
      marginVertical: 8,
      width: '100%',
      height: 1,
      backgroundColor: theme.secondary,
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

const DateRangePicker = ({
  value,
  range,
  onChange,
  minDate,
  maxDate,
  elementWidth,
  PreviousMonthButton,
  NextMonthButton,
  customStyles,
  locale,
  theme,
}: DateRangePickerProps) => {
  const dateRange = range ? value : null;
  const standaloneDate = range ? null : value;
  const [weeks, setWeeks] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [weekdayHeaders, setDayHeaders] = useState([]);
  const [displayedMonth, setDisplayedMonth] = useState(dayjs());
  const [today, setToday] = useState(dayjs());
  const styles = makeStyles(elementWidth, theme, customStyles);
  const [pan] = useState(new Animated.ValueXY());
  const [location, setLocation] = useState<{ x: number; y: number }>();
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setLocation({ x: locationX, y: locationY });
      },
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx);
        pan.y.setValue(gesture.dy);
        setLocation({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  useEffect(() => {
    if (locale) {
      dayjs.locale(locale);
      setDisplayedMonth(dayjs());
      setToday(dayjs());
    }
  }, [locale]);

  useEffect(() => {
    const hovered = (dx: number, dy: number) => {
      const start = dayjs(dateRange?.startDate);
      const end = start.clone();
      const left = Math.round(dx / 50);
      const top = Math.round(dy / 50);

      if (top || left) {
        end.add(left + top * 7, 'days');
        if (!end.isSame(start, 'month')) {
          start.clone().endOf('month');
        }
        onChange({
          endDate: end.toDate(),
          startDate: dateRange?.startDate!,
        });
      }
    };

    hovered((pan.x as any)._value, (pan.y as any)._value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, pan.x, pan.y, dateRange?.startDate]);

  /**
   * Updates the calendar view to display the previous month
   */
  const previousMonth = () => {
    setDisplayedMonth(displayedMonth.clone().subtract(1, 'months'));
  };

  /**
   * Updates the calendar view to display the next month
   */
  const nextMonth = () => {
    setDisplayedMonth(displayedMonth.clone().add(1, 'months'));
  };

  /**
   * Whether or not a calendar date cell is selected
   */
  const selected = useCallback(
    (
      _selectedDate: Dayjs,
      _startDate?: Date,
      _endDate?: Date,
      _date?: Date
    ) => {
       // TODO: Fix dayjs plugin types
      return (
        (_startDate &&
          _endDate &&
          (_selectedDate as any).isBetween(_startDate, _endDate, null, '[]')) ||
        (_startDate && _selectedDate.isSame(_startDate, 'day')) ||
        (_endDate && _selectedDate.isSame(_endDate, 'day')) ||
        (_date && _selectedDate.isSame(_date, 'day'))
      );
    },
    []
  );

  /**
   * Whether or not a calendar date cell is disabled
   */
  const disabled = useCallback(
    (_selectedDate: Dayjs, _minDate?: Date, _maxDate?: Date) => {
      return (
        (_minDate && _selectedDate.isBefore(_minDate, 'day')) ||
        (_maxDate && _selectedDate.isAfter(_maxDate, 'day'))
      );
    },
    []
  );

  /**
   * Selects the calendar date in the current cell and emits an event
   */
  const select = useCallback(
    (day: number) => {
      let _date = dayjs(displayedMonth).clone();
      _date = _date.set('date', day);
      if (range) {
        if (selecting) {
          if (_date.isBefore(dateRange?.startDate, 'day')) {
            setSelecting(!selecting);
            onChange({
              startDate: _date.toDate(),
              endDate: dateRange?.startDate!,
            });
          } else {
            setSelecting(!selecting);
            onChange({
              startDate: dateRange?.startDate!,
              endDate: _date.toDate(),
            });
          }
        } else {
          setSelecting(!selecting);
          onChange({
            endDate: null,
            startDate: _date.toDate(),
          });
        }
      } else {
        onChange({ date: _date.toDate() });
      }
    },
    [displayedMonth, range, selecting, dateRange?.startDate, onChange]
  );

  useEffect(() => {
    const makeCalendarHeader = () => {
      const _weekdayHeaders = [];
      for (let i = 0; i <= 6; ++i) {
        let day = (dayjs(displayedMonth) as any) // TODO: Fix dayjs plugin types
          .weekday(i)
          .format('dddd')
          .substring(0, 1);
        _weekdayHeaders.push(
          <WeekdayHeader
            key={`dayHeader-${i}`}
            day={day}
            cellWidth={styles.cell.width}
            theme={theme}
            customStyles={customStyles}
          />
        );
      }
      return _weekdayHeaders;
    };

    const makeCalendarBody = () => {
      let _weeks = [];
      let week: any = [];
      let daysInMonth = displayedMonth.daysInMonth();
      let startOfMonth = dayjs(displayedMonth).set('date', 1);
      let offset = (startOfMonth as any).weekday(); // TODO: Fix dayjs plugin types
      week = week.concat(
        Array.from({ length: offset }, (_, i) => (
          <CalendarDate
            isEmpty
            key={'empty-' + i}
            cellWidth={styles.cell.width}
            theme={theme}
            customStyles={customStyles}
          />
        ))
      );
      for (let i = 1; i <= daysInMonth; ++i) {
        let _date = dayjs(displayedMonth).set('date', i);
        let _disabled = disabled(_date, minDate!, maxDate!);
        let start, end;
         // TODO: Fix dayjs plugin types
        if (
          (dayjs(dateRange?.startDate) as any).isSameOrBefore(dateRange?.endDate) ||
          !dateRange?.endDate
        ) {
          start = dateRange?.startDate!;
          end = dateRange?.endDate!;
        } else {
          start = dateRange?.endDate!;
          end = dateRange?.startDate!;
        }
        let _selected = selected(_date, start, end, standaloneDate?.date!);
        week.push(
          <CalendarDate
            key={`day-${i}`}
            index={i}
            daysInMonth={daysInMonth}
            weekday={(_date as any).weekday()}
            isSelectionMode={start && !end}
            isStartDate={start && _date.isSame(start, 'date')}
            isEndDate={end && _date.isSame(end, 'date')}
            isSelected={_selected}
            isToday={_date.isSame(today, 'date')}
            isDisabled={_disabled}
            select={select}
            cellWidth={styles.cell.width}
            theme={theme}
            customStyles={customStyles}
          />
        );
        if ((i + offset) % 7 === 0 || i === daysInMonth) {
          if (week.length < 7) {
            week = week.concat(
              Array.from({ length: 7 - week.length }, (_, index) => (
                <CalendarDate
                  key={'empty-' + index}
                  isEmpty
                  cellWidth={styles.cell.width}
                  theme={theme}
                  customStyles={customStyles}
                />
              ))
            );
          }
          _weeks.push(
            <View key={'weeks-' + i} style={styles.week}>
              {week}
            </View>
          );
          week = [];
        }
      }
      return _weeks;
    };

    let _weekdayHeaders: any = makeCalendarHeader();
    let _weeks: any = makeCalendarBody();
    setDayHeaders(_weekdayHeaders);
    setWeeks(_weeks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
    displayedMonth,
    selected,
    disabled,
    minDate,
    maxDate,
    select,
    today,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
          {PreviousMonthButton ? (
            <PreviousMonthButton />
          ) : (
            <Text style={styles.navButtonLabel}>←</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.monthHeaderLabel}>
          {displayedMonth.format('MMMM YYYY')}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          {NextMonthButton ? (
            <NextMonthButton />
          ) : (
            <Text style={styles.navButtonLabel}>→</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.calendarMonth}>
        {weekdayHeaders && (
          <View style={styles.weekdaysHeader}>{weekdayHeaders}</View>
        )}
        <View style={styles.divider} />
        <Animated.View {...panResponder?.panHandlers}>{weeks}</Animated.View>
      </View>
    </View>
  );
};

export default DateRangePicker;
