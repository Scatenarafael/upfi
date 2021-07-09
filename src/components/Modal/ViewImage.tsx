import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Image,
  Link,
  Flex,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as={Flex}
        flexDirection="column"
        alignItems="flex-start"
        bg="#6b6868"
        borderRadius="10px"
      >
        <Image src={imgUrl} alt="image" borderRadius="10px" w="100%" />
        <ModalFooter p="5px" maxW="900px" maxH="600px">
          <Link href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
