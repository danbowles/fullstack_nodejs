import BannerBase from './BannerBase';

const AlertBanner = ({ message }) => {
  return (
    <BannerBase message={message} type="alert" />
  );
};

export default AlertBanner;
