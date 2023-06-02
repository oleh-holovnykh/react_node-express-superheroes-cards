import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import { HeroData } from '../../types/hero';
import { HeroCard } from '../heroCard';
import './heroList.scss';
import createNewImage from '../../images/addNew.png';

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
    <div className="list-wrapper">
      <div className="list-container">
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
        <div className="pagination-wrapper">
          <Pagination
            className="pagination"
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
