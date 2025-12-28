export class EmailHelper {
  /**
   * Génère une adresse email unique
   * Exemple: user_1708123456789@test.com
   * @param prefix Préfixe optionnel (ex: "gestionnaire")
   * @param domain Domaine optionnel (ex: "gmail.com")
   */
  static generateRandomEmail(prefix = "user", domain = "test.com"): string {
    const timestamp = Date.now(); // millisecondes pour l'unicité
    const random = Math.floor(Math.random() * 1000); // petit nombre aléatoire
    return `${prefix}_${timestamp}_${random}@${domain}`;
  }
}
