/**
 * Migration utility to convert localStorage data from VocabularyContext format to Zustand format
 */

interface LegacyFavoritesData {
  vocabulary_favorites?: number[];
  hsk_favorites?: number[];
  vietnamese_favorites?: number[];
}

interface ZustandFavoritesData {
  favorites: {
    regular: number[];
    hsk: number[];
    vietnamese: number[];
  };
}

/**
 * Migrates favorites data from legacy Context format to Zustand format
 */
export function migrateFavoritesData(): boolean {
  try {
    // Check if migration has already been performed
    const migrationFlag = localStorage.getItem('vocabulary_migration_completed');
    if (migrationFlag === 'true') {
      console.log('[Migration] Favorites data migration already completed');
      return true;
    }

    // Read legacy favorites data
    const legacyRegularFavorites = localStorage.getItem('vocabulary_favorites');
    const legacyHskFavorites = localStorage.getItem('hsk_favorites');
    const legacyVietnameseFavorites = localStorage.getItem('vietnamese_favorites');

    // Parse legacy data (arrays)
    const regularFavorites: number[] = legacyRegularFavorites 
      ? JSON.parse(legacyRegularFavorites) 
      : [];
    const hskFavorites: number[] = legacyHskFavorites 
      ? JSON.parse(legacyHskFavorites) 
      : [];
    const vietnameseFavorites: number[] = legacyVietnameseFavorites 
      ? JSON.parse(legacyVietnameseFavorites) 
      : [];

    console.log('[Migration] Found legacy favorites:', {
      regular: regularFavorites.length,
      hsk: hskFavorites.length,
      vietnamese: vietnameseFavorites.length
    });

    // Create new Zustand format (keeping as arrays for storage, Zustand will convert to Sets)
    const zustandFavoritesData: ZustandFavoritesData = {
      favorites: {
        regular: regularFavorites,
        hsk: hskFavorites,
        vietnamese: vietnameseFavorites
      }
    };

    // Store in Zustand format
    const existingVocabularyStore = localStorage.getItem('vietnamese-chinese-vocabulary');
    let vocabularyStore: any = {};
    
    if (existingVocabularyStore) {
      vocabularyStore = JSON.parse(existingVocabularyStore);
    }

    // Merge favorites data into store
    vocabularyStore.state = {
      ...vocabularyStore.state,
      ...zustandFavoritesData
    };

    // Save updated store
    localStorage.setItem('vietnamese-chinese-vocabulary', JSON.stringify(vocabularyStore));

    // Mark migration as completed
    localStorage.setItem('vocabulary_migration_completed', 'true');

    console.log('[Migration] Successfully migrated favorites data to Zustand format');
    console.log('[Migration] Migrated data:', zustandFavoritesData);

    return true;
  } catch (error) {
    console.error('[Migration] Failed to migrate favorites data:', error);
    return false;
  }
}

/**
 * Backs up current localStorage data before migration
 */
export function backupLegacyData(): boolean {
  try {
    const backup: LegacyFavoritesData = {};
    
    const regularFavorites = localStorage.getItem('vocabulary_favorites');
    const hskFavorites = localStorage.getItem('hsk_favorites');
    const vietnameseFavorites = localStorage.getItem('vietnamese_favorites');

    if (regularFavorites) backup.vocabulary_favorites = JSON.parse(regularFavorites);
    if (hskFavorites) backup.hsk_favorites = JSON.parse(hskFavorites);
    if (vietnameseFavorites) backup.vietnamese_favorites = JSON.parse(vietnameseFavorites);

    const backupData = {
      timestamp: new Date().toISOString(),
      data: backup
    };

    localStorage.setItem('vocabulary_backup', JSON.stringify(backupData));
    console.log('[Migration] Created backup of legacy data');
    return true;
  } catch (error) {
    console.error('[Migration] Failed to create backup:', error);
    return false;
  }
}

/**
 * Restores data from backup if migration fails
 */
export function restoreFromBackup(): boolean {
  try {
    const backupData = localStorage.getItem('vocabulary_backup');
    if (!backupData) {
      console.warn('[Migration] No backup data found');
      return false;
    }

    const backup = JSON.parse(backupData);
    const legacyData: LegacyFavoritesData = backup.data;

    // Restore legacy data
    if (legacyData.vocabulary_favorites) {
      localStorage.setItem('vocabulary_favorites', JSON.stringify(legacyData.vocabulary_favorites));
    }
    if (legacyData.hsk_favorites) {
      localStorage.setItem('hsk_favorites', JSON.stringify(legacyData.hsk_favorites));
    }
    if (legacyData.vietnamese_favorites) {
      localStorage.setItem('vietnamese_favorites', JSON.stringify(legacyData.vietnamese_favorites));
    }

    // Remove migration flag
    localStorage.removeItem('vocabulary_migration_completed');

    console.log('[Migration] Restored data from backup');
    return true;
  } catch (error) {
    console.error('[Migration] Failed to restore from backup:', error);
    return false;
  }
}

/**
 * Performs complete migration process with backup and validation
 */
export function performDataMigration(): boolean {
  console.log('[Migration] Starting vocabulary data migration...');

  // Step 1: Create backup
  if (!backupLegacyData()) {
    console.error('[Migration] Failed to create backup, aborting migration');
    return false;
  }

  // Step 2: Perform migration
  if (!migrateFavoritesData()) {
    console.error('[Migration] Migration failed, attempting to restore backup');
    restoreFromBackup();
    return false;
  }

  console.log('[Migration] Data migration completed successfully');
  return true;
}

/**
 * Validates that migration was successful
 */
export function validateMigration(): boolean {
  try {
    const migrationFlag = localStorage.getItem('vocabulary_migration_completed');
    if (migrationFlag !== 'true') {
      return false;
    }

    const vocabularyStore = localStorage.getItem('vietnamese-chinese-vocabulary');
    if (!vocabularyStore) {
      return false;
    }

    const store = JSON.parse(vocabularyStore);
    const favorites = store.state?.favorites;

    if (!favorites || typeof favorites !== 'object') {
      return false;
    }

    // Check that all favorite types exist
    const hasRegular = Array.isArray(favorites.regular);
    const hasHsk = Array.isArray(favorites.hsk);
    const hasVietnamese = Array.isArray(favorites.vietnamese);

    return hasRegular && hasHsk && hasVietnamese;
  } catch (error) {
    console.error('[Migration] Validation failed:', error);
    return false;
  }
}