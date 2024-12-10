import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Box, Skeleton} from 'native-base';

export default function NotesSkeleton() {
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  useEffect(() => {
    setSkeletonLoading(true);
    setTimeout(() => setSkeletonLoading(false), 5000);
  }, []);
  return (
    <View>
      <Box
        mt={2}
        p="4"
        rounded="20"
        borderWidth="1"
        borderColor="coolGray.200"
        shadow="2"
        bg="white"
        width={'80%'}
        mx={'auto'}>
        <Skeleton
          borderColor="coolGray.200"
          startColor="indigo.300"
          endColor="warmGray.50"
          mt="4"
          w="100%"
          rounded="md"
          mx={'auto'}
        />
        <Skeleton h="24" w="100%" mt={2} borderRadius="md" mx={'auto'} />
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({});
