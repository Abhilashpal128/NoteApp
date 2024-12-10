import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Modal, Skeleton} from 'native-base';

export default function Notes({
  notes,
  isLoading,
  FetchNotesBycategory,
  setIsLoading,
}) {
  const [refreshing, setRfreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const onRefresh = () => {
    try {
      setRfreshing(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        FetchNotesBycategory();
      }, 3000);
    } catch (error) {
      console.log(error.message);
      setRfreshing(false);
    } finally {
      setRfreshing(false);
      // setIsLoading(false);
    }
    setRfreshing(false);
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notes added</Text>
      </View>
    );
  };

  const handleViewNote = item => {
    console.log(item);

    setModalVisible(true);
    setSelectedNote(item);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          handleViewNote(item);
        }}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item?.title}
            </Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText} numberOfLines={2}>
              {item?.description}
            </Text>
          </View>
          <View>
            <View style={styles.cardFooter}>
              {item?.latitude ? (
                <View>
                  <Text style={styles.cardFooterHeaderText}>Location :</Text>
                  <Text style={styles.cardFooterBodyText}>
                    Lattitude :{item?.latitude}
                  </Text>
                  <Text style={styles.cardFooterBodyText}>
                    Longitude :{item?.longitude}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.NotAddedText}> No Location Added</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.listContainer}>
        {modalVisible ? (
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Content maxWidth="500px" maxHeight={'80%'}>
              <Modal.CloseButton />
              <Modal.Header mr={5}>{selectedNote?.title}</Modal.Header>
              <Modal.Body>
                {selectedNote?.image !== '' && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{uri: 'file://' + selectedNote?.image}}
                      style={styles.image}
                    />
                  </View>
                )}
                <View style={styles?.modalBodyDescriptionContainer}>
                  <Text> Note: </Text>
                  <Text>{selectedNote?.description}</Text>
                </View>
                <View style={styles.cardFooter}>
                  {selectedNote?.latitude ? (
                    <View>
                      <Text style={styles.cardFooterHeaderText}>
                        Location :
                      </Text>
                      <Text style={styles.cardFooterBodyText}>
                        Lattitude :{selectedNote?.latitude}
                      </Text>
                      <Text style={styles.cardFooterBodyText}>
                        Longitude :{selectedNote?.longitude}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.NotAddedText}>
                        {' '}
                        No Location Added
                      </Text>
                    </View>
                  )}
                </View>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  close
                </Button>
                {/* <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      setShowModal(false);
                    }}>
                    Save
                  </Button>
                </Button.Group> */}
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={item => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {width: '100%', height: '100%', backgroundColor: '#fff'},
  cardContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  card: {
    width: '80%',
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
  },
  cardHeader: {
    backgroundColor: '#6200ee',
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  cardBody: {
    padding: 10,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBodyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardFooter: {
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    borderRadius: 10,
  },
  emptyContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  listContainer: {
    // height: '100%',
    marginBottom: 50,
  },
  cardFooterHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#666',
  },
  cardFooterBodyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    marginHorizontal: 'auto',
  },
  modalBodyDescriptionContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  NotAddedText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
  },
});
