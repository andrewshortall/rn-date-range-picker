import type { TextStyle, ViewProps, ViewStyle } from 'react-native';

type Nullable<T> = T | null;

export type DateRange = {
  startDate: Nullable<Date>;
  endDate: Nullable<Date>;
};

export type StandaloneDate = {
  date: Nullable<Date>;
};

export type DateInput =
  | {
      value: DateRange;
      range: true;
    }
  | {
      value: StandaloneDate;
      range: false;
    };

export type DateChangeEvent = DateRange | StandaloneDate;

export type SupportedLocale = 'de' | 'en' | 'es' | 'fr';

export type DatePickerStyles = {
  calendarMonth?: ViewStyle;
  monthHeaderLabel?: TextStyle;
  navButton?: ViewStyle;
  weekdaysHeader?: ViewStyle;
  calendarDateLabel?: ViewStyle;
  weekdayHeaderLabel?: ViewStyle;
};

export type DatePickerTheme = {
  background?: string;
  foreground?: string;
  accent?: string;
  accentContrast?: string;
  secondary?: string;
};

export type DateRangePickerProps = DateInput & {
  onChange: (value: DateRange | StandaloneDate) => void;
  minDate?: Nullable<Date>;
  maxDate?: Nullable<Date>;
  elementWidth?: number;
  PreviousMonthButton?: React.FC<ViewProps>;
  NextMonthButton?: React.FC<ViewProps>;
  customStyles?: DatePickerStyles;
  locale?: SupportedLocale;
  theme?: DatePickerTheme;
};
