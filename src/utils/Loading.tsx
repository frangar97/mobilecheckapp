import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoadingModalProps {
  visible: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => (
  <Modal
    transparent
    animationType="none"
    visible={visible}
    onRequestClose={() => {}}
  >
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={visible} size="large" color="#0000ff" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
