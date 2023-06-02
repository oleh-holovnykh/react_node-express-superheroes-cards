import React from 'react';
import './heroCard.scss';

interface Props {
  heroNickName: string,
  imageURL: string,
  handleModalOpen: (heroNickName: string|undefined) => void,
}
export const HeroCard: React.FC<Props> = React.memo(({
  heroNickName,
  imageURL,
  handleModalOpen,
}) => (
  <div
    className="hero-card"
    role="button"
    tabIndex={0}
    onClick={() => {
      handleModalOpen(heroNickName);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleModalOpen(heroNickName);
      }
    }}
  >
    <img
      className="card-image"
      src={imageURL}
      alt={`${heroNickName}`}
    />
    <div className="card-text">
      <span className="card-text_title">
        {heroNickName}
      </span>
    </div>
  </div>
));
