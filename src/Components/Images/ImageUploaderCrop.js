import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@material-ui/core";

export default function ImageUploaderCrop(props) {
  const { onBlobChange, onPreviewUrlChange, aspectRatio, initialImageBlob } = props;
  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 100, aspect: aspectRatio ? aspectRatio : 16 / 9 });
  const [previewUrl, setPreviewUrl] = useState();
  const [initialBlobUrl, setInitialBlobUrl] = useState();

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
    // makeClientCrop(crop);
  }, []);
  const createCropPreview = React.useCallback(
    async (image, crop, fileName) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(previewUrl);
          let url = window.URL.createObjectURL(blob);
          setPreviewUrl(url);

          if (onPreviewUrlChange) onPreviewUrlChange(url);
          if (onBlobChange) onBlobChange(blob);
        }, "image/jpeg");
      });
    },
    [onBlobChange, onPreviewUrlChange, previewUrl]
  );
  const makeClientCrop = React.useCallback(
    async (crop) => {
      if (imgRef && crop.width && crop.height) {
        createCropPreview(imgRef, crop, "newFile.jpeg");
      }
    },
    [imgRef, createCropPreview]
  );

  React.useEffect(() => {
    if (initialImageBlob && !initialBlobUrl) {
      let url = window.URL.createObjectURL(initialImageBlob);
      setInitialBlobUrl(url);
    }
    return () => {
      if (initialBlobUrl) {
        window.URL.revokeObjectURL(initialBlobUrl);
      }
    };
  }, [initialImageBlob, initialBlobUrl]);

  React.useEffect(() => {
    if (!previewUrl && imgRef && crop.width && crop.height) {
      makeClientCrop(crop);
    }
  }, [imgRef, crop.width, crop.height, crop, makeClientCrop, previewUrl]);

  return (
    <div style={{ marginTop: imgRef ? 16 : 0, marginBottom: 16, textAlign: "center" }}>
      <ReactCrop
        src={upImg ? upImg : initialBlobUrl}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={makeClientCrop}
      />
      <div style={{ width: "100%", textAlign: "center" }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={onSelectFile}
        />
        <label htmlFor="raised-button-file">
          <Button disableElevation component="span" variant="outlined" style={{ margin: imgRef ? 16 : 0, width: 200 }}>
            {!imgRef ? "Choose Image" : "Change Image"}
          </Button>
        </label>
      </div>
      {/* <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div> */}

      {/* {previewUrl && <img alt="Crop preview" src={previewUrl} />} */}
    </div>
  );
}
