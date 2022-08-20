import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

import storage from "@react-native-firebase/storage";
import { Alert } from 'react-native';

export function Upload() {
  const [image, setImage] = useState('');
  const [bytes, setBytes] = useState('');
  const [progres, setProgres] = useState('0');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  async function handleUpload() {
    const filename = new Date().getTime();
    const mime = image.match(/\.(?:.(?!\.))+$/)
    const reference = storage().ref(`/images/${filename}${mime}`);

    const upload = reference.putFile(image);
    upload.on("state_changed",(task)=>{
      const percent = ((task.bytesTransferred / task.totalBytes) * 100).toFixed(0);
      setBytes(`${task.bytesTransferred} bytes transferidos de ${task.totalBytes}`);
      setProgres(percent);
    });

    upload.then(()=>{
      Alert.alert("Concluido!")
    })
  }

  return (
    <Container>
      <Header title="Lista de compras" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={handleUpload}
        />

        <Progress>
          {progres}
        </Progress>

        <Transferred>
          {bytes}
        </Transferred>
      </Content>
    </Container>
  );
}
