import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListingDetails } from '@/lib/api/listings';
import { ListingDetail } from '@/types/catalog';
import ListingView from '@/components/catalog/listing/ListingView';

interface ListingPageProps {
  params: Promise<{
    categorySlug: string;
    listingId: string; // This is actually a slug now, but keeping the param name for URL compatibility
  }>;
}

// TODO: Add metadata generation based on listing data
// export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> { ... }

async function ListingPage({ params }: ListingPageProps) {
  // Await the params Promise to resolve
  const resolvedParams = await params;

  // --- Data Fetching using the API function ---
  // listingId parameter is actually a slug for land plots
  // Backend uses slug, not ID for land plots endpoint
  const listing = await getListingDetails(resolvedParams.categorySlug, resolvedParams.listingId);

  // --- Handle Not Found --- 
  if (!listing) {
    notFound(); // Trigger 404 if API returns null or fetch fails
  }

  // REMOVE explicit access after await, use resolvedParams
  // const slugForClient = params.categorySlug; 

  return (
    // Remove the outer container div
    // <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
      
      // Pass categorySlug from resolved params to ListingView
      <ListingView listing={listing} categorySlug={resolvedParams.categorySlug} />

    // </div>
  );
}

export default ListingPage; 