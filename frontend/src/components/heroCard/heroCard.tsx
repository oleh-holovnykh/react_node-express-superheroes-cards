import React from 'react';
import styles from './heroCard.module.scss';

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
    className={styles['hero-card']}
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
      className={styles['hero-card_image']}
      src={imageURL}
      alt={`${heroNickName}`}
    />

    <span className={styles['hero-card_title']}>
      {heroNickName}
    </span>
  </div>
));
