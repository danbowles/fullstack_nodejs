import BannerBase from './BannerBase';

const SuccessBanner = ({ message }) => {
  return (
    <BannerBase type="success" message={message} />
  );
};

export default SuccessBanner;