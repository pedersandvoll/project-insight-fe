import { Button, Stack } from "@mui/material";

interface FormActionProps {
  onCancel: () => void;
  isLoading: boolean;
}

export const FormActions = (props: FormActionProps) => {
  const { onCancel, isLoading } = props;

  return (
    <Stack direction="row">
      <Button
        onClick={onCancel}
        sx={{ textTransform: "none" }}
        aria-label="Cancel form"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        loadingPosition="start"
        loading={isLoading}
        sx={{ textTransform: "none" }}
        aria-label={isLoading ? "Saving changes" : "Save changes"}
      >
        Save
      </Button>
    </Stack>
  );
};
