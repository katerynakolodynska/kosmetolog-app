import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectHeroData } from '../../redux/hero/heroSelectors';
import { selectContactInfo } from '../../redux/contact/contactSelectors';
import { selectSpecialists } from '../../redux/specialists/specialistsSelectors';

import { fetchHero } from '../../redux/hero/heroOperations';
import { fetchContact } from '../../redux/contact/contactOperation';
import { getAllSpecialists } from '../../redux/specialists/specialistsOperations';

import HeroSection from '../../components/sections/HeroSection/HeroSection';
import AboutOwner from '../../components/layout/AboutOwner/AboutOwner';
import OpinionsSection from '../../components/sections/OpinionsSection/OpinionsSection';
import Loader from '../../components/shared/Loader/Loader';

const Home = () => {
  const dispatch = useDispatch();

  const hero = useSelector(selectHeroData);
  const contact = useSelector(selectContactInfo);
  const specialists = useSelector(selectSpecialists);

  useEffect(() => {
    dispatch(fetchHero());
    dispatch(fetchContact());
    dispatch(getAllSpecialists());
  }, [dispatch]);

  const isLoading = !hero || !contact || specialists.length === 0;

  if (isLoading) {
    return <Loader show />;
  }

  return (
    <>
      <HeroSection />
      <AboutOwner />
      <OpinionsSection limit={3} />
    </>
  );
};

export default Home;
