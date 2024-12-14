import { Box, Grid, Skeleton, Typography } from "@mui/material"

const ListSkeleton = () => {
  return (
    <Grid container wrap="nowrap" sx={{
      justifyContent: "center",
      alignItems: "center",
    }}>
      {Array.from(new Array(3)).map((item, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
          <Skeleton variant="rectangular" width={210} height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </Box>
      ))}
    </Grid>
  )
}

export default ListSkeleton