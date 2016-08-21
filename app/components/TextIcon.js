import React from 'react';
import styles from './TextIcon.css';

export type Props = {
  title: string | number | React.Element;
};

export default function TextIcon(props: Props) {
  const {
    title,
    ...otherProps,
  } = props;

  return (
    <div
      className={styles.icon}
      {...otherProps}
    >
      {title}
    </div>
  );
}

