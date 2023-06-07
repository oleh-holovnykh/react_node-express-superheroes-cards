import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import { HeroData } from 'types/hero';
import createNewImage from 'images/addNew.png';
import { HeroCard } from 'components/heroCard';
import styles from './heroList.module.scss';

interface Props {
  heroes: HeroData[];
  handleModalOpen: (heroNickName:string|undefined) => void;
}
export const HeroList: React.FC<Props> = ({ heroes, handleModalOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(5);

  const pageCount = Math.ceil(heroes.length / cardsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = heroes.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className={styles['list-wrapper']}>
      <div className={styles['list-container']}>
        {currentCards.map((hero) => (
          <HeroCard
            key={hero.id}
            heroNickName={hero.nickname}
            imageURL={hero.imagesURLs[0][1]}
            handleModalOpen={handleModalOpen}
          />
        ))}
        <HeroCard
          heroNickName="Add new Hero"
          imageURL={createNewImage}
          handleModalOpen={handleModalOpen}
        />
      </div>
      {pageCount >= 2 && (
        <div className={styles['pagination-background']}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};
