import React, {
  ChangeEvent, useRef, useState,
} from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import './addHeroForm.scss';
import { client } from '../../utils/fetchClient';
import { getAllImagesURLs, getAllPathsFromDirectory, uploadImage } from '../../firebase';
import { HeroData } from '../../types/hero';

interface Props {
  onDataUpdate: () => void;
  onModalClose: () => void;
}
export const AddHeroForm: React.FC<Props> = ({ onDataUpdate, onModalClose }) => {
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
        await uploadImage(nickname, file);
      }));
    }

    const imagesPaths = await getAllPathsFromDirectory(nickname);

    newHero.imagesURLs = await getAllImagesURLs(imagesPaths);

    if (filesInput.current && filesInput.current.value) {
      filesInput.current.value = '';
    }

    await client.post('/', newHero);

    setFileList(null);
    onDataUpdate();
    setIsLoading(false);
    onModalClose();
  };

  return (
    <div className="add-form-container">
      <form action="submit" className="add-form" onSubmit={handleFormSubmit}>
        <TextField
          className="add-form_field"
          id="outlined-basic"
          label="Nickname"
          variant="outlined"
          value={nickname}
          size="small"
          onChange={(e) => setNickname(e.target.value)}
        />

        <TextField
          className="add-form_field"
          id="outlined-basic"
          label="Real name"
          variant="outlined"
          value={realName}
          size="small"
          onChange={(e) => setRealName(e.target.value)}
        />

        <TextField
          className="add-form_field"
          id="outlined-multiline-flexible"
          label="Origin description"
          multiline
          maxRows={4}
          defaultValue="Origin description"
          value={originDescription}
          size="small"
          onChange={(e) => setOriginDescription(e.target.value)}
        />

        <TextField
          className="add-form_field"
          id="outlined-multiline-flexible"
          label="Superpowers"
          multiline
          maxRows={4}
          defaultValue="Superpowers"
          value={superpowers}
          size="small"
          onChange={(e) => setSuperpowers(e.target.value)}
        />

        <TextField
          className="add-form_field"
          id="outlined-multiline-flexible"
          label="Catch phrase"
          multiline
          maxRows={4}
          defaultValue="Catch phrase"
          value={catchPhrase}
          size="small"
          onChange={(e) => setCatchPhrase(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={filesInput}
          className="file-input"
        />

        {!isLoading
          ? (
            <Button
              className="add-form_button"
              type="submit"
              variant="contained"
              color="success"
              size="small"
            >
              Add Hero
            </Button>
          )
          : <CircularProgress color="success" />}
      </form>
    </div>
  );
};
