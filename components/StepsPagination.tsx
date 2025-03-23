import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import Swiper from 'react-native-swiper';

interface PropsStepsPagination {
    infoRenderSteps: any[]
}

export default function StepPagination({infoRenderSteps}:PropsStepsPagination) {
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        index={currentPage}
        autoplay={false}
        showsButtons={false}
        showsPagination={true}
        
      >
        {infoRenderSteps.map((element) => element)}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginTop: 20,
  },
  page: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});