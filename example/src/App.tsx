import { StyleSheet, View } from 'react-native';
import DateRangePicker, {
  type DateChangeEvent,
  type DateRange,
  type SupportedLocale,
} from '@kurzalle/rn-date-range-picker';
import dayjs from 'dayjs';
import { useState } from 'react';
require('dayjs/locale/de');
dayjs.locale('de', {}, true);

const dates = {
  startDate: dayjs().subtract(5, 'days').toDate(),
  endDate: dayjs().add(5, 'days').toDate(),
};

export default function App() {
  const [dateFilter, setDateFilter] = useState<DateRange>(dates);
  const [locale] = useState<SupportedLocale>('en');

  const setRange = (value: DateChangeEvent) => {
    const event = value as DateRange;
    if (event.startDate && event.endDate) {
      return setDateFilter({
        startDate: event.startDate,
        endDate: event.endDate,
      });
    }
    if (event.startDate) {
      return setDateFilter({
        startDate: event.startDate,
        endDate: null,
      });
    }
    if (event.endDate) {
      return setDateFilter({
        startDate: dateFilter.startDate,
        endDate: event.endDate,
      });
    }
  };

  return (
    <View style={styles.container}>
      <DateRangePicker
        value={dateFilter}
        range={true}
        onChange={setRange}
        locale={locale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
