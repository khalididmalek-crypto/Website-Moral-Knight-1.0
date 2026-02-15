
from PIL import Image

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # Get the background color from the top-left pixel
    bg_color = data[0]
    
    new_data = []
    # threshold for color similarity
    threshold = 80 
    
    for item in data:
        # Calculate distance to background color
        dist = sum((item[i] - bg_color[i]) ** 2 for i in range(3)) ** 0.5
        if dist < threshold:
            # Make it fully transparent
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path)
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    make_transparent(
        "/Users/khalididmalek/Moral Knight 1.0/Bedrijf X kopie/MK Responsible AI 1.0 - backup - premobiel - nieuw kopie 2/public/MK logo.png",
        "/Users/khalididmalek/Moral Knight 1.0/Bedrijf X kopie/MK Responsible AI 1.0 - backup - premobiel - nieuw kopie 2/public/MK logo transparent.png"
    )
