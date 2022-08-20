import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

import { photosData } from '../../utils/photo.data';

import storage from "@react-native-firebase/storage"

export function Receipts() {
  const [photos, setPhotos] = useState([] as FileProps[]);
  const [activeImage, setActiveImage] = useState('');
  const [photoInfo, setPhotoInfo] = useState('');

  async function fetchImages(){
    await storage().ref("/images")
      .list().then((result) => {
        const files: FileProps[] = []
        result.items.forEach((item) => {
          files.push({
            name: item.name,
            path: item.fullPath
          })
        });

        setPhotos(files);
      })
  }
  useEffect(()=>{
    fetchImages();
  },[]);

  async function handleShowImage(uri: string){
    const urlImage = await storage().ref(uri).getDownloadURL();
    setActiveImage(urlImage);

    const info = await storage().ref(uri).getMetadata();
    setPhotoInfo(`uploaded at ${info.timeCreated}`)
  }

  async function handleDeleteImage(uri: string){
    await storage().ref(uri).delete();
    fetchImages();
  }
  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={activeImage} />

      <PhotoInfo>
        {photoInfo}
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => handleDeleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
