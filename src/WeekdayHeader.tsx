import { View, StyleSheet, Text, Dimensions } from 'react-native';
import type { DatePickerStyles, DatePickerTheme } from './utils/types';
import { defaultTheme } from './utils/theme';

const { width } = Dimensions.get('screen');

const makeStyles = (
  cellWidth = Math.floor(width / 7),
  theme = defaultTheme,
  { weekdayHeaderLabel = {} }: DatePickerStyles = {}
) =>
  StyleSheet.create({
    weekdayHeader: {
      width: cellWidth,
      height: '100%',
      justifyContent: 'center',
    },
    weekdayHeaderLabel: {
      textAlign: 'center',
      fontSize: 16,
      color: theme.secondary,
      ...weekdayHeaderLabel,
    },
  });

type WeekdayHeaderProps = {
  day: string;
  cellWidth: number;
  customStyles?: DatePickerStyles;
  theme?: DatePickerTheme;
};

const WeekdayHeader = ({
  day,
  cellWidth,
  customStyles,
  theme,
}: WeekdayHeaderProps) => {
  const styles = makeStyles(cellWidth, theme, customStyles);

  return (
    <View style={styles.weekdayHeader}>
      <Text style={styles.weekdayHeaderLabel}>{day}</Text>
    </View>
  );
};

export default WeekdayHeader;
