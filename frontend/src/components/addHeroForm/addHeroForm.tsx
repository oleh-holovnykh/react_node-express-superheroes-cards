import React from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { client } from 'utils/fetchClient';
import { HeroData } from 'types/hero';
import { getAllImagesURLs, getAllPathsFromDirectory, uploadImage } from 'firebase';
import { Field, Form } from 'react-final-form';
import styles from './addHeroForm.module.scss';

interface Props {
  onModalClose: () => void;
  onDataUpdate: () => Promise<void>;
}

interface FormValues {
  nickname: string,
  realName: string,
  originDescription: string,
  superpowers: string,
  catchPhrase: string,
  files: FileList,
}

interface ErrorValues {
  nickname?: string,
  realName?: string,
  originDescription?: string,
  superpowers?: string,
  catchPhrase?: string,
  files?: string,
}

export const AddHeroForm: React.FC<Props> = ({ onModalClose, onDataUpdate }) => {
  const handleFormSubmit = async (values: FormValues) => {
    const {
      nickname,
      realName,
      originDescription,
      superpowers,
      catchPhrase,
      files,
    } = values;

    const newHero: Partial<HeroData> = {
      nickname,
      realName,
      originDescription,
      superpowers,
      catchPhrase,
      imagesURLs: [],
    };

    if (files) {
      const images = [...files];

      await Promise.all(images.map(async (file) => {
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

    try {
      await client.post('/', newHero);
      await onDataUpdate();
    } catch (e: any) {
      throw new Error(`Can't add hero: ${e.message}. Try it later`);
    }

    toast.success(`${newHero.nickname} was added`);
    onModalClose();
  };

  return (
    <div className={styles['add-form-container']}>
      <Form
        onSubmit={handleFormSubmit}
        validate={values => {
          const errors: ErrorValues = {};

          if (!values.nickname) {
            errors.nickname = 'Required';
          }

          if (!values.realName) {
            errors.realName = 'Required';
          }

          if (!values.originDescription) {
            errors.originDescription = 'Required';
          }

          if (!values.superpowers) {
            errors.superpowers = 'Required';
          }

          if (!values.catchPhrase) {
            errors.catchPhrase = 'Required';
          }

          return errors;
        }}
      >
        {({ handleSubmit, submitting }) => (
          <form className={styles['add-form']} onSubmit={handleSubmit}>
            <Field name="nickname">
              {({ input, meta }) => (
                <TextField
                  className={styles['add-form_field']}
                  id="outlined-basic"
                  label="Nickname"
                  variant="outlined"
                  size="small"
                  error={meta.error && meta.touched}
                  helperText={meta.touched && meta.error}
                  {...input}
                />
              )}
            </Field>

            <Field name="realName">
              {({ input, meta }) => (
                <TextField
                  className={styles['add-form_field']}
                  id="outlined-basic"
                  label="Real name"
                  variant="outlined"
                  size="small"
                  {...input}
                  error={meta.touched && meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>

            <Field name="originDescription">
              {({ input, meta }) => (
                <TextField
                  className={styles['add-form_field']}
                  id="outlined-multiline-flexible"
                  label="Origin description"
                  multiline
                  maxRows={4}
                  size="small"
                  {...input}
                  error={meta.touched && meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>

            <Field name="superpowers">
              {({ input, meta }) => (
                <TextField
                  className={styles['add-form_field']}
                  id="outlined-multiline-flexible"
                  label="Superpowers"
                  multiline
                  maxRows={4}
                  size="small"
                  {...input}
                  error={meta.touched && meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>

            <Field name="catchPhrase">
              {({ input, meta }) => (
                <TextField
                  className={styles['add-form_field']}
                  id="outlined-multiline-flexible"
                  label="Catch phrase"
                  multiline
                  maxRows={4}
                  size="small"
                  {...input}
                  error={meta.touched && meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>

            <Field name="files" multiple>
              {({ input }) => (
                <input
                  type="file"
                  multiple
                  onChange={(event) => input.onChange(event.target.files)}
                  className={styles['file-input']}
                />
              )}
            </Field>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="small"
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress
                  sx={{
                    margin: 'auto',
                  }}
                  color="success"
                />
              ) : 'Add Hero'}
            </Button>
          </form>
        )}
      </Form>
    </div>
  );
};
