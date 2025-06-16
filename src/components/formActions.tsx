import { Button, Stack } from "@mui/material";

interface FormActionProps {
  onCancel: () => void;
  isLoading: boolean;
}

export const FormActions = (props: FormActionProps) => {
  const { onCancel, isLoading } = props;

  return (
    <Stack direction="row">
      <Button onClick={onCancel} sx={{ textTransform: "none" }}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        loadingPosition="start"
        loading={isLoading}
        sx={{ textTransform: "none" }}
      >
        Save
      </Button>
    </Stack>
  );
};
