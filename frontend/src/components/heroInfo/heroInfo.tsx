import React, { useState } from 'react';
import {
  Box, Button, CircularProgress, Modal, TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { HeroData } from '../../types/hero';
import './heroInfo.scss';
import { client } from '../../utils/fetchClient';
import { deleteImage } from '../../firebase';

interface Props {
  hero: HeroData;
  onDataUpdate: () => void;
  onModalClose: () => void;
}
export const HeroInfo: React.FC<Props> = ({ hero, onDataUpdate, onModalClose }) => {
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

    await client.patch(`/${id}`, newHeroInfo);
    await onDataUpdate();
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

    await client.delete(`/${id}`);
    await onDataUpdate();
    onModalClose();

    setIsLoading(false);
  };

  const handleDeletePhoto = async (imgPath: string) => {
    setIsImageLoading(prevState => [...prevState, imgPath]);

    await deleteImage(imgPath);

    const newimagesURLs = imagesURLs.filter(imageURL => imageURL[0] !== imgPath);

    await client.patch(`/${id}`, { imagesURLs: newimagesURLs });
    await onDataUpdate();

    setPhotoURLs(newimagesURLs);
    setIsImageLoading(prevState => prevState.filter(element => element !== imgPath));
  };

  return (
    <div className="info-container">
      <div className="info-container_main-info">
        <div className="info-container_main-photo">
          <img className="main-img" src={imagesURLs[0][1]} alt={nickname} />
        </div>
        <div className="info-container_hero-info">
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
                <p>
                  <strong>
                    {'Nickname: '}
                  </strong>
                  {nick}
                </p>
                <p>
                  <strong>
                    {'Real name: '}
                  </strong>
                  {name}
                </p>
                <p>
                  <strong>
                    {'Origin: '}
                  </strong>
                  {origin}
                </p>
                <p>
                  <strong>
                    {'Superpowers: '}
                  </strong>
                  {powers}
                </p>
                <p>
                  <strong>
                    {'Catch phrase: '}
                  </strong>
                  {phrase}
                </p>
              </>
            )}
        </div>
      </div>
      <strong>Galery:</strong>
      <div className="info-container_photo-gallery">
        {photoURLs.map((imageUrl, i) => {
          const isThisImageLoading = isImageLoading.includes(imageUrl[0]);

          return (
            <div
              key={imageUrl[0]}
              role="button"
              tabIndex={0}
              className="img-container"
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
                className="gallery-img"
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
                    position: 'absolute',
                    top: '50%',
                    right: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  color="error"
                />
              )}
            </div>
          );
        })}
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
        <div className="modal-content">
          <Box sx={{
            width: '700px',
            height: '600px',
          }}
          >
            <img className="modal-image" src={selectedImage} alt="Selected" />
          </Box>
        </div>
      </Modal>
    </div>
  );
};
