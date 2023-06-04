import React, { ChangeEvent, useRef, useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import './addHeroForm.scss';
import { toast } from 'react-toastify';
import { client } from '../../utils/fetchClient';
import { getAllImagesURLs, getAllPathsFromDirectory, uploadImage } from '../../firebase';
import { HeroData } from '../../types/hero';

interface Props {
  onModalClose: () => void;
  onDataUpdate: () => Promise<void>;
}

export const AddHeroForm: React.FC<Props> = ({ onModalClose, onDataUpdate }) => {
  const [nickname, setNickname] = useState('');
  const [realName, setRealName] = useState('');
  const [originDescription, setOriginDescription] = useState('');
  const [superpowers, setSuperpowers] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const filesInput = useRef<HTMLInputElement | null>(null);

  const clearForm = () => {
    setNickname('');
    setRealName('');
    setOriginDescription('');
    setSuperpowers('');
    setCatchPhrase('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileList(event.target.files);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    clearForm();

    const newHero: Partial<HeroData> = {
      nickname,
      realName,
      originDescription,
      superpowers,
      catchPhrase,
      imagesURLs: [],
    };

    if (fileList) {
      const files = [...fileList];

      await Promise.all(files.map(async (file) => {
        try {
          await uploadImage(nickname, file);
        } catch (e:any) {
          throw new Error(`Can't upload image: ${e.message}. Try again later`);
        }
      }));
    }

    try {
      const imagesPaths = await getAllPathsFromDirectory(nickname);

      newHero.imagesURLs = await getAllImagesURLs(imagesPaths);
    } catch (e: any) {
      throw new Error(`Can't get images URLs from storage: ${e.message}. Try again later`);
    }

    if (filesInput.current && filesInput.current.value) {
      filesInput.current.value = '';
    }

    try {
      await client.post('/', newHero);
      await onDataUpdate();
    } catch (e: any) {
      throw new Error(`Can't add hero: ${e.message}. Try it later`);
    }

    setFileList(null);
    setIsLoading(false);
    toast.success(`${newHero.nickname} was added`);
    onModalClose();
  };

  return (
    <div className="add-form-container">
      <form className="add-form" onSubmit={handleFormSubmit}>
        {!isLoading ? (
          <>
            <TextField
              className="add-form_field"
              id="outlined-basic"
              label="Nickname"
              variant="outlined"
              value={nickname}
              size="small"
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              className="add-form_field"
              id="outlined-basic"
              label="Real name"
              variant="outlined"
              value={realName}
              size="small"
              onChange={(e) => setRealName(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              className="add-form_field"
              id="outlined-multiline-flexible"
              label="Origin description"
              multiline
              maxRows={4}
              value={originDescription}
              size="small"
              onChange={(e) => setOriginDescription(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              className="add-form_field"
              id="outlined-multiline-flexible"
              label="Superpowers"
              multiline
              maxRows={4}
              value={superpowers}
              size="small"
              onChange={(e) => setSuperpowers(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              className="add-form_field"
              id="outlined-multiline-flexible"
              label="Catch phrase"
              multiline
              maxRows={4}
              value={catchPhrase}
              size="small"
              onChange={(e) => setCatchPhrase(e.target.value)}
              disabled={isLoading}
            />

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={filesInput}
              className="file-input"
              disabled={isLoading}
            />
            <Button
              className="add-form_button"
              type="submit"
              variant="contained"
              color="success"
              size="small"
            >
              Add Hero
            </Button>
          </>
        ) : (
          <CircularProgress
            sx={{
              margin: 'auto',
            }}
            color="success"
          />
        )}
      </form>
    </div>
  );
};
