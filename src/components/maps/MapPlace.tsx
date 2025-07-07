import * as MS from "@/styles/MapStyles";

interface IMapPlace {
  address: string;
}
export default function MapPlace({ address }: IMapPlace) {
  return (
    <MS.MapInfoBox>
      <MS.AddressMain>{address}</MS.AddressMain>
    </MS.MapInfoBox>
  );
}
