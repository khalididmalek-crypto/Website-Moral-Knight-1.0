from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        # iPhone 12 as a representative mobile device
        iphone_12 = p.devices['iPhone 12']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**iphone_12)
        page = context.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        
        # Wait a bit for any hydration
        time.sleep(2)

        print("Looking for Contact tile...")
        # Search for the text "Contact" in the specific div structure of mobile tiles
        contact_tile = page.get_by_text("Contact", exact=True)
        
        if contact_tile.is_visible():
            print("Clicking Contact tile...")
            contact_tile.click()
            
            # Wait for the scroll animation to complete (we have 800ms delay + 2500ms duration)
            print("Waiting for scroll sequence to complete (4 seconds)...")
            time.sleep(4)
            
            # Check final scroll position
            scroll_y = page.evaluate("document.querySelector('div.overflow-y-auto').scrollTop")
            print(f"Final scroll position: {scroll_y}")
            
            # Take a screenshot to verify
            page.screenshot(path="mobile_contact_scroll.png")
            print("Screenshot saved to mobile_contact_scroll.png")
        else:
            print("Contact tile not found!")
            # Print page content or take screenshot for debugging
            page.screenshot(path="debug_not_found.png")

        browser.close()

if __name__ == "__main__":
    run()
