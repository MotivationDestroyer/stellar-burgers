import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import type { TAppHeaderUIProps } from './type';
import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} p-4`
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2 mr-2">Конструктор</p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} p-4`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <NavLink to="/" className={styles.logo} aria-label="На главную">
        <Logo className="" />
      </NavLink>
      <div className={styles.link_position_last}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} p-4`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">
                {userName ?? 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
