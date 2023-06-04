/* eslint-disable no-console */
import React, { ChangeEvent, useState } from 'react';
import {
  Button, CircularProgress, Modal, TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { HeroData } from '../../types/hero';
import './heroInfo.scss';
import { client } from '../../utils/fetchClient';
import {
  deleteDirectory, deleteImage, getAllImagesURLs, getAllPathsFromDirectory, uploadImage,
} from '../../firebase';
import addImage from '../../images/add-image.svg';

interface Props {
  hero: HeroData;
  onModalClose: () => void;
  onDataUpdate: () => Promise<void>
}
export const HeroInfo: React.FC<Props> = React.memo(({ hero, onModalClose, onDataUpdate }) => {
  const {
    id,
    nickname,
    realName,
    originDescription,
    superpowers,
    catchPhrase,
    imagesURLs,
  } = hero;

  const [nick, setNick] = useState(nickname);
  const [name, setName] = useState(realName);
  const [origin, setOrigin] = useState(originDescription);
  const [powers, setPowers] = useState(superpowers);
  const [phrase, setPhrase] = useState(catchPhrase);
  const [photoURLs, setPhotoURLs] = useState(imagesURLs);
  const [selectedImage, setSelectedImage] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<string[]>([]);

  const handleFilesUploadOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!event.target.files) {
      return;
    }

    setIsImageLoading(state => [...state, 'add new photo\'s']);

    const files = [...event.target.files];

    await Promise.all(files.map(async (file) => {
      try {
        await uploadImage(nickname, file);
      } catch (e: any) {
        throw new Error(`Can't upload image: ${e.message}`);
      }
    }));

    try {
      const imagesPaths = await getAllPathsFromDirectory(nickname);
      const imagesPathsWithURLs = await getAllImagesURLs(imagesPaths);

      await client.patch(`/${id}`, { imagesURLs: imagesPathsWithURLs });

      await onDataUpdate();

      setPhotoURLs(imagesPathsWithURLs);
    } catch (e: any) {
      throw new Error(`Can't upload new photos: ${e.message}`);
    }

    setIsImageLoading(state => state.filter(img => img !== 'add new photo\'s'));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const newHeroInfo = {
      nickname: nick,
      realName: name,
      originDescription: origin,
      superpowers: powers,
      catchPhrase: phrase,
    };

    try {
      await client.patch(`/${id}`, newHeroInfo);
    } catch (e:any) {
      throw new Error(`Can't update hero information: ${e.message}`);
    }

    setIsLoading(false);
    setShowEditForm(false);
  };

  const handleCancel = () => {
    setNick(nickname);
    setName(realName);
    setOrigin(originDescription);
    setPowers(superpowers);
    setPhrase(catchPhrase);
    setShowEditForm(false);
  };

  const handleOpenEditForm = () => {
    setShowEditForm(true);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDeleteHero = async () => {
    setIsLoading(true);

    try {
      await deleteDirectory(`${nickname}/`);

      await client.delete(`/${id}`);

      await onDataUpdate();
    } catch (e: any) {
      throw new Error(`I was unable to delete the hero. Something went wrong: ${e.message}`);
    }

    toast.success('Hero was deleted');
    onModalClose();
    setIsLoading(false);
  };

  const handleDeletePhoto = async (imgPath: string) => {
    setIsImageLoading(state => [...state, imgPath]);

    try {
      await deleteImage(imgPath);

      const newImagesURLs = photoURLs.filter(imageURL => imageURL[0] !== imgPath);

      setPhotoURLs(newImagesURLs);

      await client.patch(`/${id}`, { imagesURLs: newImagesURLs });

      await onDataUpdate();
    } catch (e:any) {
      throw new Error(`Something went wrong: ${e.message}`);
    }

    setIsImageLoading(state => state.filter(element => element !== imgPath));
  };

  return (
    <div className="info-container">
      <div className="info-container_main">
        <div className="info-container_main_photo">
          <img className="info-container_main_photo_img" src={imagesURLs[0][1]} alt={nickname} />
        </div>
        <div className="info-container_main_info">
          {showEditForm
            ? (
              <form onSubmit={handleUpdate}>
                <TextField
                  className="add-form_field"
                  id="outlined-basic"
                  label="Nickname"
                  variant="outlined"
                  value={nick}
                  size="small"
                  onChange={(e) => setNick(e.target.value)}
                  disabled={isLoading}
                />

                <TextField
                  className="add-form_field"
                  id="outlined-basic"
                  label="Real name"
                  variant="outlined"
                  value={name}
                  size="small"
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />

                <TextField
                  className="add-form_field"
                  id="outlined-multiline-flexible"
                  label="Origin description"
                  multiline
                  maxRows={4}
                  defaultValue="Origin description"
                  value={origin}
                  size="small"
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={isLoading}
                />

                <TextField
                  className="add-form_field"
                  id="outlined-multiline-flexible"
                  label="Superpowers"
                  multiline
                  maxRows={4}
                  defaultValue="Superpowers"
                  value={powers}
                  size="small"
                  onChange={(e) => setPowers(e.target.value)}
                  disabled={isLoading}
                />

                <TextField
                  className="add-form_field"
                  id="outlined-multiline-flexible"
                  label="Catch phrase"
                  multiline
                  maxRows={4}
                  defaultValue="Catch phrase"
                  value={phrase}
                  size="small"
                  onChange={(e) => setPhrase(e.target.value)}
                  disabled={isLoading}
                />

                {!isLoading
                  ? (
                    <>
                      <div className="button-container">
                        <div>
                          <Button
                            sx={{ marginRight: '20px' }}
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                          >
                            Update
                          </Button>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={handleCancel}
                            size="small"
                          >
                            Cancel
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          color="error"
                          onClick={handleDeleteHero}
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )
                  : <CircularProgress color="success" />}
              </form>
            )
            : (
              <>
                <span>
                  <strong>
                    {'Nickname: '}
                  </strong>
                  {nick}
                </span>
                <span>
                  <strong>
                    {'Real name: '}
                  </strong>
                  {name}
                </span>
                <span>
                  <strong>
                    {'Origin: '}
                  </strong>
                  {origin}
                </span>
                <span>
                  <strong>
                    {'Superpowers: '}
                  </strong>
                  {powers}
                </span>
                <span>
                  <strong>
                    {'Catch phrase: '}
                  </strong>
                  {phrase}
                </span>
              </>
            )}
        </div>
      </div>
      <div className="info-container_gallery">
        <strong className="info-container_gallery_title">Gallery:</strong>
        <div className="info-container_gallery_photos">
          {photoURLs.map((imageUrl, i) => {
            const isThisImageLoading = isImageLoading.includes(imageUrl[0]);

            return (
              <div
                key={imageUrl[0]}
                role="button"
                tabIndex={0}
                className="info-container_gallery_photos_img-container"
                onClick={() => {
                  handleImageClick(imageUrl[1]);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleImageClick(imageUrl[1]);
                  }
                }}
              >
                <img
                  className="info-container_gallery_photos_img"
                  src={imageUrl[1]}
                  alt={`${nickname} ${i}`}
                />

                {showEditForm && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(imageUrl[0]);
                    }}
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '2px',
                    }}
                    aria-label="delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}

                {isThisImageLoading && (
                  <CircularProgress
                    style={{
                      position: 'absolute' as const,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    color="error"
                  />
                )}
              </div>
            );
          })}
          {showEditForm && (
            <label htmlFor="file-input" className="info-container_gallery_photos_img-container">
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFilesUploadOnChange}
                className="file-input"
              />
              {!isImageLoading.includes('add new photo\'s') && (
                <img
                  className="info-container_gallery_photos_img"
                  src={addImage}
                  alt="plus button"
                />
              )}

              {isImageLoading.includes('add new photo\'s') && (
                <CircularProgress
                  style={{
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  color="primary"
                />
              )}
            </label>
          )}
        </div>
      </div>

      {!showEditForm && (
        <IconButton
          sx={{
            position: 'absolute',
            top: '15px',
            right: '15px',
          }}
          onClick={handleOpenEditForm}
          aria-label="Edit"
        >
          <EditIcon />
        </IconButton>
      )}

      <Modal
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage('')}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-photo">
          <img className="modal-photo_image" src={selectedImage} alt="Selected" />
        </div>
      </Modal>
    </div>
  );
});
