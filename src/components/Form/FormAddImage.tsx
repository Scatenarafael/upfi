import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { Resolver, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiImgbb } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const formValidations = yup.object().shape({
    image: yup
      .mixed()
      .required()
      .test('type', 'O formato da imagem precisa ser jpeg ou png', value => {
        return (
          value &&
          (value[0].type === 'image/jpeg' || value[0].type === 'image/png')
        );
      })
      .test('fileSize', 'O arquivo precisa ter menos de 10 MB', value => {
        return value && value[0].size <= 10000000;
      }),
    title: yup
      .string()
      .required('Título Obrigatório')
      .min(6, 'O Título precisa ter no mínimo 6 caracteres')
      .max(20, 'O Título pode ter no máximo 20 caracteres'),
    description: yup
      .string()
      .required('Descrição Obrigatória')
      .max(65, 'A descrição da imagem deve ter no máximo 65 caracteres'),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    {
      // TODO ONSUCCESS MUTATION
      // onSuccess: () => {
      //   queryClient.invalidateQueries('images');
      // },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({
      resolver: yupResolver(formValidations),
    });
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      console.log(data);

      const imgresp = await getBase64(data.image[0]);

      const base64Img = String(imgresp).split(',')[1];

      console.log(base64Img);

      apiImgbb
        .post(
          `upload?expiration=600&key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            data: {
              image: base64Img,
            },
          }
        )
        .then(response => console.log(response));
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image')}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          name="title"
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title')}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          name="description"
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description')}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
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
