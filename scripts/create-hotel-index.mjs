
// scripts/create-hotel-index.mjs
import path from "path";
import fs from "fs/promises";

// public/hotels 디렉토리 경로 설정
const hotelsDirectory = path.join(process.cwd(), "public", "hotels");
// 생성될 인덱스 파일 경로 설정
const indexPath = path.join(process.cwd(), "public", "hotel-index.json");

/**
 * 모든 호텔 데이터 파일에서 hotel_id와 hotel_translated_name만 추출하여
 * 하나의 인덱스 파일을 생성하는 스크립트
 */
async function createHotelIndex() {
  console.log("호텔 인덱스 생성을 시작합니다...");

  try {
    // 1. public/hotels 디렉토리의 모든 파일을 읽어옵니다.
    const files = await fs.readdir(hotelsDirectory);
    const hotelDataFiles = files.filter(
      (file) => file.startsWith("travelwiser_data") && file.endsWith(".json")
    );

    // 2. 모든 파일의 내용을 읽고 호텔 정보를 하나의 배열로 합칩니다.
    let allHotels = [];
    console.log(`${hotelDataFiles.length}개의 파일을 처리합니다.`);

    for (const file of hotelDataFiles) {
      const filePath = path.join(hotelsDirectory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent).data;

      if (data && Array.isArray(data)) {
        // 각 호텔 객체에서 필요한 정보(id, name)만 추출하여 추가합니다.
        // NOTE: 일부 파일은 hotel_id 키에 BOM(\uFEFF) 문자를 포함하고, 일부는 그렇지 않으므로 둘 다 확인합니다.
        const hotels = data
          .map((item) => {
            const hotel_id = item.metadata?.["\uFEFFhotel_id"] || item.metadata?.hotel_id;
            const hotel_translated_name = item.metadata?.hotel_translated_name;
            const hotel_name = item.metadata?.hotel_name;
            return { hotel_id, hotel_translated_name, hotel_name };
          })
          .filter((hotel) => hotel.hotel_id && (hotel.hotel_translated_name || hotel.hotel_name));

        allHotels.push(...hotels);
      }
    }

    console.log(`총 ${allHotels.length}개의 호텔 정보를 찾았습니다.`);

    // 3. 합쳐진 데이터를 hotel-index.json 파일로 저장합니다.
    await fs.writeFile(indexPath, JSON.stringify(allHotels, null, 2));

    console.log(`✅ 호텔 인덱스 파일이 성공적으로 생성되었습니다: ${indexPath}`);
  } catch (error) {
    console.error("❌ 호텔 인덱스 생성 중 오류가 발생했습니다:", error);
  }
}

// 스크립트 실행
createHotelIndex();
