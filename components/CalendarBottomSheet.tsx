import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Button } from './Button';
import { useTheme } from '../styles/theme';
import { CycleDetails } from './CycleDetails';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  Extrapolation,
} from 'react-native-reanimated';

interface CalendarBottomSheetProps {
  selectedDate: string;
  cycleDay: number | null;
  averageCycleLength: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CalendarBottomSheet({
  selectedDate,
  cycleDay,
  averageCycleLength,
  isOpen,
  onOpenChange,
}: CalendarBottomSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('calendar');
  const bottomSheetRef = useRef<any>(null);
  const animatedIndex = useSharedValue(0);
  const contentHeightSv = useSharedValue(0);
  const [snapPoints, setSnapPoints] = useState<number[]>([1]);

  const onSheetContentLayout = useCallback(
    (e: any) => {
      const height = e?.nativeEvent?.layout?.height ?? 0;
      contentHeightSv.value = height;
      const computed = Math.max(1, Math.ceil(height));
      setSnapPoints([computed]);
    },
    [contentHeightSv]
  );

  const closeDrawer = useCallback(() => {
    bottomSheetRef.current?.close?.();
    onOpenChange(false);
  }, [onOpenChange]);

  const closedBottom = 20;
  const fabAnimatedStyle = useAnimatedStyle(() => {
    const contentHeight = contentHeightSv.value;
    const openBottom = contentHeight + 16;
    return {
      bottom: interpolate(
        animatedIndex.value,
        [-1, 0],
        [closedBottom, openBottom],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        style={[styles.floatingButton, fabAnimatedStyle]}
        pointerEvents="box-none"
      >
        <Button
          title={t('editPeriod.editPeriodDates')}
          onPress={() => router.push('/edit-period')}
        />
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={snapPoints}
        animatedIndex={animatedIndex}
        enablePanDownToClose
        enableOverDrag={false}
        onChange={(i: number) => onOpenChange(i >= 0)}
        backgroundStyle={{
          backgroundColor: colors.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: -8 },
          shadowOpacity: 0.8,
          shadowRadius: 12,
          elevation: 12,
        }}
        handleComponent={() => null}
      >
        <BottomSheetView
          onLayout={onSheetContentLayout}
          style={styles.sheetContent}
        >
          <CycleDetails
            selectedDate={selectedDate}
            cycleDay={cycleDay}
            averageCycleLength={averageCycleLength}
            onClose={closeDrawer}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  sheetContent: {
    paddingTop: 8,
  },
});
