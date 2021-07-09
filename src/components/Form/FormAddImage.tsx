import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { api } from '../../services/api';

interface FormAddImageProps {
  closeModal: () => void;
}

type CreateImageFormData = {
  url: string;
  title: string;
  description: string;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v =>
          /image\/(jpeg|png|gif)/.test(v[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título Obrigatório',
      validate: {
        minLength: title => title.length > 2 || 'Mínimo de 2 caracteres',
        maxLength: title => title.length < 20 || 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descição Obrigatória',
      validate: {
        maxLength: description =>
          description.length < 65 || 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async ({ url, title, description }: CreateImageFormData) => {
      // TODO MUTATION API POST REQUEST
      const response = await api.post('api/images', {
        url,
        title,
        description,
      });

      return response;
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<CreateImageFormData> = async data => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
      console.log(data);
      const response = await fetch(imageUrl);
      if (response.status !== 200) {
        toast({
          title: 'Imagem não salva',
          description: 'Houve algum erro no carregamento da imagem',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      const values = {
        url: imageUrl,
        title: data.title,
        description: data.description,
      };
      await mutation.mutateAsync(values);

      toast({
        title: 'Sucesso',
        description: 'Imagem Cadastrada com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Imagem não salva',
        description: 'Houve algum erro no carregamento da imagem',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          name="image"
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          name="title"
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          name="description"
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
