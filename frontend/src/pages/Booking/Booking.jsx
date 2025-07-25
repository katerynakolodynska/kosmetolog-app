import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContact } from '../../redux/contact/contactOperation';
import { getAllServices } from '../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../redux/specialists/specialistsOperations';
import { selectContactInfo } from '../../redux/contact/contactSelectors';
import { selectServices } from '../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../redux/specialists/specialistsSelectors';
import Loader from '../../components/shared/Loader/Loader';
import BookingSection from '../../components/sections/BookingSection/BookingSection';
import { logPageViewGA } from '../../utils/analytics';

const Booking = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const contact = useSelector(selectContactInfo);

  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllSpecialists());
    dispatch(fetchContact());
  }, [dispatch]);

  useEffect(() => {
    logPageViewGA();
  }, []);

  const isLoading = !services.length || !specialists.length || !contact;

  if (isLoading) return <Loader show />;

  return <BookingSection />;
};

export default Booking;
