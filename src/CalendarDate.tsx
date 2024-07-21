import { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Easing,
  Animated,
  Dimensions,
} from 'react-native';
import type { DatePickerStyles, DatePickerTheme } from './utils/types';
import { defaultTheme } from './utils/theme';
const { width } = Dimensions.get('screen');

const makeStyles = (
  cellWidth = Math.floor(width / 7),
  theme = defaultTheme,
  { calendarDateLabel = {} }: DatePickerStyles = {}
) => {
  const cellHeight = cellWidth;
  const roundedEdge = 8;
  return StyleSheet.create({
    day: {
      width: cellWidth,
      height: cellHeight,
      justifyContent: 'center',
      marginVertical: 1,
    },
    calendarDateLabel: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.foreground,
      ...calendarDateLabel,
    },
    roundedLeftSide: {
      borderTopLeftRadius: roundedEdge,
      borderBottomLeftRadius: roundedEdge,
    },
    roundedRightSide: {
      borderTopRightRadius: roundedEdge,
      borderBottomRightRadius: roundedEdge,
    },
    startDate: {
      borderTopLeftRadius: cellWidth,
      borderBottomLeftRadius: cellWidth,
    },
    endDate: {
      borderTopRightRadius: cellWidth,
      borderBottomRightRadius: cellWidth,
    },
    startDateLabel: {
      color: theme.accentContrast,
    },
    endDateLabel: {
      color: theme.accentContrast,
    },
    startDateMarker: {
      height: cellHeight,
      width: cellWidth,
      backgroundColor: theme.accent,
      borderRadius: cellWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    endDateMarker: {
      height: cellHeight,
      width: cellWidth,
      backgroundColor: theme.accent,
      borderRadius: cellWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayMarker: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
      borderRadius: cellWidth - 4,
      borderColor: theme.accent,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayLimitMarker: {
      borderColor: theme.background,
      color: theme.background,
    },
    selected: {
      backgroundColor: theme.secondary,
      height: cellHeight,
      width: cellWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedLabel: {
      color: theme.foreground,
    },
    todayLabel: {
      color: theme.accent,
    },
    disabledLabel: {
      color: theme.secondary,
    },
    disabled: {},
    abs: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    absLabel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      lineHeight: cellHeight - 2,
    },
  });
};

type CalendarDateProps = {
  cellWidth: number;
  index?: number;
  daysInMonth?: number;
  weekday?: number;
  customStyles?: DatePickerStyles;
  theme?: DatePickerTheme;
  isStartDate?: boolean;
  isEndDate?: boolean;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isToday?: boolean;
  isEmpty?: boolean;
  select?: (day: number) => void;
};

const CalendarDate = ({
  index,
  daysInMonth,
  weekday,
  cellWidth,
  customStyles,
  theme,
  isStartDate,
  isEndDate,
  isSelectionMode,
  isSelected,
  isDisabled,
  isToday,
  isEmpty,
  select,
}: CalendarDateProps) => {
  const selectThis = () => {
    if (!isDisabled) {
      select?.(index!);
    }
  };
  const styles = makeStyles(cellWidth, theme, customStyles);
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = () => {
      rotateAnimation.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 2,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    if (isSelectionMode) {
      rotate();
    }
  }, [rotateAnimation, isSelectionMode]);

  const opacity = rotateAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0.6', '0.85', '0.6'],
  });

  return (
    <TouchableOpacity
      key={'day-' + index}
      activeOpacity={0.75}
      onPressIn={isEmpty ? () => {} : selectThis}
    >
      <View style={styles.day}>
        <View
          style={[
            styles.day,
            weekday === 0 || index === 1 ? styles.roundedLeftSide : {},
            weekday === 6 || index === daysInMonth
              ? styles.roundedRightSide
              : {},
            isStartDate ? styles.startDate : {},
            isEndDate ? styles.endDate : {},
            isSelected && !isSelectionMode ? styles.selected : {},
            isDisabled ? styles.disabled : {},
          ]}
        >
          <Animated.View
            style={[
              styles.abs,
              isStartDate ? styles.startDateMarker : {},
              isEndDate ? styles.endDateMarker : {},
              isStartDate && isSelectionMode ? { opacity } : {},
            ]}
          />
          {isToday && (
            <Animated.View
              style={[
                styles.todayMarker,
                isStartDate ? styles.todayLimitMarker : {},
                isEndDate ? styles.todayLimitMarker : {},
              ]}
            />
          )}
          <Text
            style={[
              styles.absLabel,
              styles.calendarDateLabel,
              isSelected ? styles.selectedLabel : {},
              isDisabled ? styles.disabledLabel : {},
              isToday ? styles.todayLabel : {},
              isStartDate ? styles.startDateLabel : {},
              isEndDate ? styles.endDateLabel : {},
            ]}
          >
            {index}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CalendarDate;
