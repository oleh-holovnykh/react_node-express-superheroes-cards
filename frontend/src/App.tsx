import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import styles from 'App.module.scss';
import { AddHeroForm } from 'components/addHeroForm/addHeroForm';
import { HeroData } from 'types/hero';
import { client } from 'utils/fetchClient';
import { HeroList } from 'components/heroList';
import { CustomModal } from 'components/customModal';
import { HeroInfo } from 'components/heroInfo';

export const App: React.FC = () => {
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHero, setModalHero] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchHeroes = async () => {
    if (!isModalOpen) {
      setIsLoading(true);
    }

    try {
      const allHeroes = await client.get('/');

      setHeroes(allHeroes);
    } catch (e) {
      throw new Error('Cant get any heroes :(');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);

    if (modalHero) {
      setModalHero(null);
    }
  };

  const handleModalOpen = (heroNickName:string|undefined) => {
    if (heroNickName !== 'Create new Hero!') {
      const selectedHero = heroes.find(hero => hero.nickname === heroNickName);

      if (selectedHero) {
        setModalHero(selectedHero);
      }
    }

    setIsModalOpen(true);
  };

  return (
    <div className={styles['app-container']}>
      {!isLoading && (
        <>
          <HeroList
            heroes={heroes}
            handleModalOpen={handleModalOpen}
          />

          <CustomModal
            isOpen={isModalOpen}
            handleClose={handleModalClose}
          >
            {modalHero ? (
              <HeroInfo
                hero={modalHero!}
                onModalClose={handleModalClose}
                onDataUpdate={fetchHeroes}
              />
            ) : (
              <AddHeroForm
                onDataUpdate={fetchHeroes}
                onModalClose={handleModalClose}
              />
            )}
          </CustomModal>
        </>
      )}
      {isLoading && <CircularProgress color="primary" />}
    </div>
  );
};
